import {Types} from "mongoose"

export type TOrder =  {
    tax: number;
    shippingFee: number;
    subTotal:  number;
    total: number;
    orderItems: Array<TSingleOrderItem>
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'failed' | 'cancelled'
    user: Types.ObjectId;
    clientSecret: string;
    paymentId: string
}

export type TSingleOrderItem = {
    name: string;
    images: Array<string>;
    price: number;
    quantity: number;
    product :Types.ObjectId;
}