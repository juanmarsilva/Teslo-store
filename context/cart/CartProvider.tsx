import { FC, PropsWithChildren, useEffect, useReducer, useRef } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
}

interface Props extends PropsWithChildren {}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [ state, dispatch ] = useReducer( cartReducer, CART_INITIAL_STATE );

    const isReloading = useRef(true);

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
    

    return (
        <CartContext.Provider 
            value={{ 
                ...state, 
                
                // Methods:
                addProduct,
                updateCartQuantity,
                removeCartProduct
            }}
        >

            { children }
            
        </CartContext.Provider>
    )
}