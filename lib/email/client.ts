import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const EMAIL_FROM = process.env.EMAIL_FROM || 'LaunchFast <onboarding@resend.dev>'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return { error: 'Not configured' }
  }

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  })

  if (error) {
    console.error('Email send error:', error)
    return { error }
  }

  return { data }
}
