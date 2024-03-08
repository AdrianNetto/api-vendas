
import { IProduct } from '@modules/products/domain/models/IProduc';

export interface IRequestCreateOrder {
  customer_id: string;
  products: IProduct[];
}
