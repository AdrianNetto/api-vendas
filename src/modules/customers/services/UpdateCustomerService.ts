import { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import { inject, injectable } from 'tsyringe';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import Customer from '../infra/typeorm/entities/Customer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class UpdateProductService {
  constructor(
    private customersRepository: ICustomersRepository
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    const productWithSameName = await this.customersRepository.findByName(name);

    if (!customer) {
      throw new AppError('Product not found');
    }

    if (productWithSameName && productWithSameName.id !== id) {
      throw new AppError('There is already one product with this name');
    }

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);

    return customer;
  }
}

export default UpdateProductService;
