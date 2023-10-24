import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';

type CartActionType =
| { type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: ICartProduct[] }
| { type: '[CART] - LOAD ADDRESS FROM COOKIES | LOCALSTORAGE', payload: ShippingAddress }
| { type: '[CART] - UPDATE ADDRESS', payload: ShippingAddress }
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


/**
 * The `cartReducer` function is a TypeScript reducer that handles various actions related to updating
 * the state of a shopping cart.
 * @param {CartState} state - The current state of the cart, which includes properties such as
 * `isLoaded`, `cart`, and `shippingAddress`.
 * @param {CartActionType}  - - `state`: The current state of the cart.
 * @returns The cartReducer function returns the updated state of the cart based on the action type and
 * payload provided.
 */
export const cartReducer = ( state: CartState, { type, payload }: CartActionType ): CartState => {

    if( type === '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE' ) {
        return {
           ...state,
           isLoaded: true,
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

    if( type === '[CART] - LOAD ADDRESS FROM COOKIES | LOCALSTORAGE' ) {
        return {
            ...state,
            shippingAddress: payload,
        }
    };

    if( type === '[CART] - UPDATE ADDRESS' ) {
        return {
            ...state,
            shippingAddress: payload,
        }
    };

    return state;
}