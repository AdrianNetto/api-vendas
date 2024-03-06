import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findOne(id);

    if (!customer) {
      throw new AppError('Product not found');
    }

    await customersRepository.remove(customer);
  }
}

export default DeleteProductService;
