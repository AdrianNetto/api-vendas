import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

interface IRequest {
  id: string;
}

class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const user = await customersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowCustomerService;
