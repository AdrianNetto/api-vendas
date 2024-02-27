import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import path from 'path';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository copy';
import EtherealMail from '@config/mail/EtherealMail';
import SESMail from "@config/mail/SESMail";
import mailConfig from "@config/mail/mail"

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User doesn't exists");
    }

    const { token } = await userTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    if(mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: 'Reset password - API Vendas',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_API_URL}/reset-password?token=${token}`
          },
        },
      });
      return;
    }

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Reset password - API Vendas',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_API_URL}/reset-password?token=${token}`
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
