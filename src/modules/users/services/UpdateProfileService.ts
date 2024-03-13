import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/IUsersRepository';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUser } from '../domain/models/IUser';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);
    {
      if (!user) {
        throw new AppError('User not found');
      }

      const userUpdateEmail = await this.usersRepository.findByEmail(email);

      if (userUpdateEmail && userUpdateEmail.id !== user_id) {
        throw new AppError('This email is already in use');
      }

      if (password && !old_password) {
        throw new AppError('Old Password is required');
      }

      if (password && old_password) {
        const checkOldPassowrd = await compare(old_password, user.password);

        if (!checkOldPassowrd) {
          throw new AppError('Passwords does not match');
        }

        user.password = await hash(password, 8);
      }

      user.name = name;
      user.email = email;

      await this.usersRepository.save(user);

      return user;
    }
  }
}

export default UpdateProfileService
