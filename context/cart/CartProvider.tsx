import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
export interface CartState {
    cart: ICartProduct[];
}

interface Props {
    children?: JSX.Element | JSX.Element[];
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [ state, dispatch ] = useReducer( cartReducer, CART_INITIAL_STATE );

    useEffect(() => {
        const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
        dispatch({ type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: cookieProducts }) 
    }, [])

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    const addProduct = ( product: ICartProduct ) => {

        const isProductInCart = state.cart.some( p => p._id === product._id );
        if( !isProductInCart ) return dispatch({ type: '[CART] - UPDATE PRODUCTS IN CART', payload: [...state.cart, product ]});


        const isProductInCartButDiffSize = state.cart.some( p => p._id === product._id && p.size === product.size );
        if( !isProductInCartButDiffSize ) return dispatch({ type: '[CART] - UPDATE PRODUCTS IN CART', payload: [...state.cart, product ]});

        const updatedProducts = state.cart.map( p => {
            if( p._id !== product._id ) return p;
            if( p.size !== product.size ) return p;

            p.quantity += product.quantity;
            return p;
        })

        return dispatch({ type: '[CART] - UPDATE PRODUCTS IN CART', payload: updatedProducts});

    }

    return (
        <CartContext.Provider value={{ 
            ...state, 
            
            // Methods:
            addProduct,
            }}>

            { children }
            
        </CartContext.Provider>
    )
}