import { ISize, IUser } from "./";

export interface IOrder {
    _id?:                string;
    user?:              IUser | string;
    orderItems:         Array<IOrderItem>;
    shippingAddress:     ShippingAddress;
    paymentResult?:     string;

    numberOfItems:      number;
    subtotal:           number;
    tax:                number;
    total:              number;

    isPaid:             boolean;
    paidAt?:            string;
}

export interface IOrderItem {
    _id:        string;
    title:      string;
    size:       ISize;
    quantity:   number;
    slug:       string;
    image:      string;
    price:      number;
    gender:     string;
}

export interface ShippingAddress {
    firstName:  string;
    lastName:   string;
    address:    string;
    address2?:  string;
    zipCode:    string;
    country:    string;
    province:   string;
    city:       string;
    phone:      string;
}