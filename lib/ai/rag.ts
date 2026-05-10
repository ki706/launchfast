import { OpenAI } from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

/**
 * Generates an embedding for the given text using OpenAI's text-embedding-3-small model.
 */
export async function embed(text: string): Promise<number[]> {
  if (!openai) throw new Error('OpenAI API key not configured')
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dimensions
    input: text.replace(/\n/g, ' '),
  })
  
  return response.data[0].embedding
}

/**
 * Stores a document with its embedding in the vector database.
 */
export async function storeDocument({
  content,
  userId,
  metadata = {},
}: {
  content: string
  userId: string
  metadata?: Record<string, unknown>
}) {
  const supabase = await createClient()
  const embedding = await embed(content)
  
  const { error } = await supabase.from('launchfast_documents').insert({
    user_id: userId,
    content,
    embedding,
    metadata,
  })
  
  if (error) throw error
}

/**
 * Performs semantic search across a user's documents.
 */
export async function searchDocuments({
  query,
  userId,
  limit = 5,
  threshold = 0.5,
}: {
  query: string
  userId: string
  limit?: number
  threshold?: number
}) {
  const supabase = await createClient()
  const queryEmbedding = await embed(query)
  
  const { data, error } = await supabase.rpc('match_launchfast_documents', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
    p_user_id: userId,
  })
  
  if (error) throw error
  return data
}
