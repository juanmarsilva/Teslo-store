import { createContext } from 'react';

import { ICartProduct, ShippingAddress } from '../../interfaces';

/* The `ContextProps` interface defines the shape of the context object that will be provided by the
`CartContext` context. It specifies the properties and methods that will be available to components
that consume this context. */
interface ContextProps {
    isLoaded:            boolean;
    cart:                ICartProduct[];
    numberOfItems:       number;
    subtotal:            number;
    tax:                 number;
    total:               number;

    shippingAddress?:    ShippingAddress;

    // Methods:
    addProduct:             ( product: ICartProduct ) => void;
    updateCartQuantity:     ( product: ICartProduct ) => void;
    removeCartProduct:      ( product: ICartProduct ) => void;
    updateShippingAddress:  ( address: ShippingAddress ) => void;
    createOrder:            () => Promise<{ hasError: boolean, message: string }>;
}


export const CartContext = createContext( {} as ContextProps );