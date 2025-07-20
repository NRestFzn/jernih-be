import {env} from '../common/utils/envConfig';
import nodeMailer from 'nodemailer';
import ResponseError from './response/ResponseError';

const transporter = nodeMailer.createTransport({
  service: env.MAIL_SERVICE,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

async function sendMail(
  senderAddress: string,
  subject: string,
  description: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: senderAddress,
      to: env.MAIL_RECEIVER,
      subject: subject,
      html: `from : ${senderAddress} <br> ${description}`,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    throw new ResponseError.InternalServer('Failed send email');
  }
}

export const MailSmpt = {
  sendMail,
};
