import formData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export const sendEmail = async (to: string, subject: string, text: string, html: string, cc?: string): Promise<void> => {
  const data = {
    from: process.env.MAILGUN_FROM,
    to,
    subject,
    text,
    html,
    cc
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN || '', data);
  } catch (error) {
    console.error(JSON.stringify(error))
    throw new Error(`Failed to send email: ${error}`);
  }
};
