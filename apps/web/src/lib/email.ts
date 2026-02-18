import { NotConfiguredError } from '@/api/core/errors';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const getMailjetConfig = () => {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const fromEmail = process.env.MAILJET_FROM_EMAIL;
  const fromName = process.env.MAILJET_FROM_NAME || 'AutoBlogger';

  if (!apiKey || !secretKey || !fromEmail) {
    throw new NotConfiguredError(
      'Email provider is not configured. Set MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_FROM_EMAIL.'
    );
  }

  return { apiKey, secretKey, fromEmail, fromName };
};

export const sendTransactionalEmail = async (input: SendEmailInput) => {
  const config = getMailjetConfig();
  const credentials = Buffer.from(`${config.apiKey}:${config.secretKey}`).toString('base64');

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: config.fromEmail,
            Name: config.fromName,
          },
          To: [
            {
              Email: input.to,
            },
          ],
          Subject: input.subject,
          TextPart: input.text,
          HTMLPart: input.html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send email (${response.status}): ${body.slice(0, 500)}`);
  }
};

