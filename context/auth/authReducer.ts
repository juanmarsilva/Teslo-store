import { STATES } from 'mongoose';
import { IUser } from '../../interfaces';
import { AuthState } from './';


type AuthActionType =
    | { type: '[AUTH] - LOGIN', payload: IUser}
    | { type: '[AUTH] - LOGOUT', payload: IUser}


export const authReducer = ( state: AuthState, { type, payload }: AuthActionType ): AuthState => {

    if( type === '[AUTH] - LOGIN' ) {
        return {
            ...state,
            isLoggedIn: true,
            user: payload,
        }
    }

    if( type === '[AUTH] - LOGOUT' ) {
        return {
            ...state,
            user: undefined,
            isLoggedIn: false,
        }
    }

    return state;

}