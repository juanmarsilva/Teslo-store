import { FC, PropsWithChildren, useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { TesloApi } from '../../api';

/* The `CartState` interface defines the shape of the state object used in the `CartProvider`
component. It includes the following properties: */
export interface CartState {
    isLoaded:           boolean;
    cart:               ICartProduct[];
    numberOfItems:      number;
    subtotal:           number;
    tax:                number;
    total:              number;
    shippingAddress?:   ShippingAddress;
};

interface Props extends PropsWithChildren {}

/* `const CART_INITIAL_STATE` is a constant variable that initializes the initial state for the
`CartProvider` component. It is of type `CartState`, which is an interface defining the shape of the
state object used in the `CartProvider` component. */
const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

/**
 * The `CartProvider` component is a context provider that manages the state and actions related to a
 * shopping cart.
 * @param  - - `Props`: The type definition for the props passed to the `CartProvider` component.
 * @returns The `CartProvider` component is being returned.
 */
export const CartProvider: FC<Props> = ({ children }) => {

    const [ state, dispatch ] = useReducer( cartReducer, CART_INITIAL_STATE );

    const isReloading = useRef(true);

    /*In this case, the `useEffect` hook is used to load the shipping address from cookies or local storage when the
    component mounts. */
    useEffect(() => {
        if( Cookie.get('firstName') ) {
            const shippingAddress = {
                firstName : Cookie.get('firstName') || '', 
                lastName  : Cookie.get('lastName') || '',  
                address   : Cookie.get('address') || '',   
                address2  : Cookie.get('address2') || '',  
                zipCode   : Cookie.get('zipCode') || '',   
                country   : Cookie.get('country') || '',   
                province  : Cookie.get('province') || '',  
                city      : Cookie.get('city') || '',      
                phone     : Cookie.get('phone') || '', 
            };
    
            dispatch({ type: '[CART] - LOAD ADDRESS FROM COOKIES | LOCALSTORAGE', payload: shippingAddress });
        }
    }, [])
    
    /* The `useEffect` hook is used to load the cart from cookies or local storage when the component
    mounts. */
    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
            dispatch({ type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: cookieProducts }) 
        } catch (error) {
            dispatch({ type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: [] }) 
        }
    }, []);

   /* The `useEffect` hook is used to save the cart to cookies or local storage whenever the
   `state.cart` value changes. */
    useEffect(() => {
        if( isReloading.current ) {
            isReloading.current = false;
        } else {
            Cookie.set('cart', JSON.stringify(state.cart));
        }
    }, [state.cart]);

    /* The `useEffect` hook in the provided code is used to update the order summary whenever the
    `state.cart` value changes. */
    useEffect(() => {

        const numberOfItems = state.cart.reduce((prevValue, current) => current.quantity + prevValue, 0);

        const subtotal = state.cart.reduce((prevValue, current) => (current.quantity * current.price) + prevValue, 0);
        
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subtotal,
            tax: subtotal * taxRate,
            total: subtotal * (taxRate + 1)
        }

        dispatch({ type: '[CART] - UPDATE ORDER SUMMARY', payload: orderSummary });

    }, [state.cart]);


    /**
     * The function `addProduct` checks if a product is already in the cart, and if not, adds it to the
     * cart; if the product is already in the cart but with a different size, it adds it to the cart;
     * and if the product is already in the cart with the same size, it updates the quantity of the
     * product in the cart.
     * @param {ICartProduct} product - The `product` parameter is an object of type `ICartProduct`.
     * @returns a dispatch action with the type '[CART] - UPDATE PRODUCTS IN CART' and the payload
     * containing the updated products.
     */
    const addProduct = ( product: ICartProduct ) => {

        const isProductInCart = state.cart.some( p => p._id === product._id );

        if( !isProductInCart ) return dispatch({
            type: '[CART] - UPDATE PRODUCTS IN CART', 
            payload: [...state.cart, product ]
        });

        const isProductInCartButDiffSize = state.cart.some( p => p._id === product._id && p.size === product.size );

        if( !isProductInCartButDiffSize ) return dispatch({
            type: '[CART] - UPDATE PRODUCTS IN CART', 
            payload: [...state.cart, product ]
        });

        const updatedProducts = state.cart.map( p => {
            if( p._id !== product._id ) return p;
            if( p.size !== product.size ) return p;

            p.quantity += product.quantity;
            return p;
        })

        return dispatch({ type: '[CART] - UPDATE PRODUCTS IN CART', payload: updatedProducts});

    }

    /**
     * The function updates the quantity of a product in the cart.
     * @param {ICartProduct} product - The `product` parameter is an object of type `ICartProduct`. It
     * represents a product that needs to be updated in the cart.
     */
    const updateCartQuantity = ( product: ICartProduct ) => dispatch(
        { 
            type: '[CART] - UPDATE PRODUCTS QUANTITY IN CART', 
            payload: product 
        }
    );
    

    /**
     * The function `removeCartProduct` is used to dispatch an action to remove a product from the
     * cart.
     * @param {ICartProduct} product - The `product` parameter is of type `ICartProduct`, which
     * represents a product in the cart.
     */
    const removeCartProduct = ( product: ICartProduct ) => dispatch(
        { 
            type: '[CART] - REMOVE PRODUCT IN CART',
            payload: product 
        }
    );

    /**
     * The function updates the shipping address and dispatches an action to update the address in the
     * cart.
     * @param {ShippingAddress} address - The `address` parameter is an object of type
     * `ShippingAddress` which contains the following properties:
     */
    const updateShippingAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2!);
        Cookie.set('zipCode', address.zipCode);
        Cookie.set('country', address.country);
        Cookie.set('province', address.province);
        Cookie.set('city', address.city);
        Cookie.set('phone', address.phone);

        dispatch({ type: '[CART] - UPDATE ADDRESS', payload: address });
    }
    
    /**
     * The function `createOrder` is an asynchronous function that creates an order by sending a POST
     * request to a specified API endpoint and returns a promise that resolves to an object with
     * information about the success or failure of the operation.
     * @returns The `createOrder` function returns a promise that resolves to an object with two
     * properties: `hasError` and `message`. The `hasError` property is a boolean indicating whether an
     * error occurred during the execution of the function. The `message` property is a string that
     * provides additional information about the result of the function.
     */
    const createOrder = async (): Promise<{ hasError: boolean, message: string }> => {
        if( !state.shippingAddress ) throw new Error('No hay dirección de entrega');

        const order: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subtotal: state.subtotal,
            total: state.total,
            tax: state.tax,
            isPaid: false,
        }

        try {

            const { data } = await TesloApi.post<IOrder>('/orders', order);

            dispatch({ type: '[CART] - ORDER COMPLETE', payload: null });

            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            if( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                }
            };

            return {
                hasError: true,
                message: 'Error no controlado - Hable con el administrador',
            }
        }
    };

    return (
        <CartContext.Provider 
            value={{ 
                ...state, 
                
                //* Methods:
                addProduct,
                updateCartQuantity,
                removeCartProduct,
                updateShippingAddress,

                //* Orders
                createOrder,
            }}
        >

            { children }
            
        </CartContext.Provider>
    )
}