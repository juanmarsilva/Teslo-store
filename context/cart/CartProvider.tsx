import { FC, PropsWithChildren, useEffect, useReducer, useRef } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

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

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [ state, dispatch ] = useReducer( cartReducer, CART_INITIAL_STATE );

    const isReloading = useRef(true);

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
    
    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
            dispatch({ type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: cookieProducts }) 
        } catch (error) {
            dispatch({ type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: [] }) 
        }
    }, []);

    useEffect(() => {
        if( isReloading.current ) {
            isReloading.current = false;
        } else {
            Cookie.set('cart', JSON.stringify(state.cart));
        }
    }, [state.cart]);

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

    const updateCartQuantity = ( product: ICartProduct ) => dispatch(
        { 
            type: '[CART] - UPDATE PRODUCTS QUANTITY IN CART', 
            payload: product 
        }
    );
    

    const removeCartProduct = ( product: ICartProduct ) => dispatch(
        { 
            type: '[CART] - REMOVE PRODUCT IN CART',
            payload: product 
        }
    );

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
    

    return (
        <CartContext.Provider 
            value={{ 
                ...state, 
                
                // Methods:
                addProduct,
                updateCartQuantity,
                removeCartProduct,
                updateShippingAddress
            }}
        >

            { children }
            
        </CartContext.Provider>
    )
}