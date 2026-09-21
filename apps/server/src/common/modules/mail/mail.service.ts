import { createTransport, type Transporter } from 'nodemailer'
import { mailConfig } from '@/config'

export class MailService {
  private readonly transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.code
      }
    })
  }

  async sendMail(email: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: mailConfig.user,
      to: email,
      subject,
      html
    })
  }
}
