import { CartState } from './';
import { ICartProduct } from '../../interfaces';

type CartActionType =
| { type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: ICartProduct[] }
| { type: '[CART] - UPDATE PRODUCTS IN CART', payload: ICartProduct[] }
| { type: '[CART] - UPDATE PRODUCTS QUANTITY IN CART', payload: ICartProduct }
| { type: '[CART] - REMOVE PRODUCT IN CART', payload: ICartProduct }
| { 
    type: '[CART] - UPDATE ORDER SUMMARY', 
    payload: {
        numberOfItems: number;
        subtotal: number;
        tax: number;
        total: number;
    } 
}


export const cartReducer = ( state: CartState, { type, payload }: CartActionType ): CartState => {

    if( type === '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE' ) {
        return {
           ...state,
           cart: [ ...payload ],
        }
    }

    if( type === '[CART] - UPDATE PRODUCTS IN CART' ) {
        return {
            ...state,
            cart: [ ...payload ],
        }
    }

    if( type === '[CART] - UPDATE PRODUCTS QUANTITY IN CART' ) {
        return {
            ...state,
            cart: state.cart.map( product => {
                if( product._id !== payload._id ) return product;
                if( product.size !== payload.size ) return product;
                product.quantity = payload.quantity;
                return payload;
            })
        }
    }

    if( type === '[CART] - REMOVE PRODUCT IN CART' ) {
        return {
            ...state,
            cart: state.cart.filter( product => !(product._id === payload._id && product.size === payload.size) )
        }
    }

    if( type === '[CART] - UPDATE ORDER SUMMARY' ) {

        return {
            ...state,
            ...payload
        }

    }

    return state;
}