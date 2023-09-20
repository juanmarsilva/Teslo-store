import { CartState } from './';
import { ICartProduct } from '../../interfaces';

type CartActionType =
| { type: '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE', payload: ICartProduct[] }
| { type: '[CART] - UPDATE PRODUCTS IN CART', payload: ICartProduct[] }


export const cartReducer = ( state: CartState, { type, payload }: CartActionType ): CartState => {

    if( type === '[CART] - LOAD CART FROM COOKIES | LOCALSTORAGE' ) {
        return {
           ...state,
           cart: [ ...payload ]
        }
    }


    if( type === '[CART] - UPDATE PRODUCTS IN CART' ) {
        return {
            ...state,
            cart: [ ...payload ],
        }
    }

    return state;
}