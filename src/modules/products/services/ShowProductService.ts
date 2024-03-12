
import AppError from '@shared/errors/AppError';
import { injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IShowProduct } from '../domain/models/IShowProduct';
import { IProductsRepository } from '../domain/models/IProductRepository';

@injectable()
class ShowProductService {
  constructor(
    private productsRepository: IProductsRepository
  ) {}

  public async execute({ id }: IShowProduct): Promise<IProduct> {

    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    return product;
  }
}

export default ShowProductService;
