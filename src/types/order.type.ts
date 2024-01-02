import {Types} from "mongoose"

export type TOrder =  {
    tax: number;
    shippingFee: number;
    subTotal:  number;
    total: number;
    orderItems: Types.DocumentArray<TSingleOrderItem>
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'failed' | 'cancelled'
    user: Types.ObjectId;
    clientSecret: string;
    paymentId: string
}

export type TSingleOrderItem = {
    name: string;
    images: Types.Array<string>;
    price: number;
    quantity: number;
    product :Types.ObjectId;
}