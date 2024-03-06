import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '../infra/http/typeorm/repositories/OrdersRepository';
import AppError from '@shared/errors/AppError';
import Order from '../infra/http/typeorm/entities/Order';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);

    const order = await ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found.');
    }

    return order;
  }
}

export default ShowOrderService;
