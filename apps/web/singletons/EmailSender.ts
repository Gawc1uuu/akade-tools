import { Resend } from 'resend';

interface SendEmailOptions {
  to: string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export class EmailSender {
  private static instance: EmailSender;
  private resend: Resend;

  private constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      throw new Error('RESEND_API_KEY is not set');
    }
    this.resend = new Resend(apiKey);
  }

  public static getInstance(): EmailSender {
    if (!EmailSender.instance) {
      EmailSender.instance = new EmailSender();
    }
    return EmailSender.instance;
  }

  public async sendEmail(options: SendEmailOptions) {
    const { to, subject, react, from } = options;

    const fromAddress = from || 'Fleet Management <onboarding@resend.dev>';

    try {
      const { data, error } = await this.resend.emails.send({
        from: fromAddress,
        to,
        subject,
        react,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send email');
    }
  }
}
