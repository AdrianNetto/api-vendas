import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateProductService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findOneOrFail(id);

    const productWithSameName = await customerRepository.findByName(name);

    if (!customer) {
      throw new AppError('Product not found');
    }

    if (productWithSameName && productWithSameName.id !== id) {
      throw new AppError('There is already one product with this name');
    }

    customer.name = name;
    customer.email = email;

    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateProductService;
