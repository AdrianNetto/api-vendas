import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/models/IProductRepository';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) {}

  public async execute({ id, name, price, quantity }: IUpdateProduct): Promise<IProduct> {

    const product = await this.productsRepository.findById(id);

    const productWithSameName = await this.productsRepository.findByName(name);

    if (!product) {
      throw new AppError('Product not found');
    }

    if (productWithSameName && productWithSameName.id !== id) {
      throw new AppError('There is already one product with this name');
    }

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
