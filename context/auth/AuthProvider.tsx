import { FC, PropsWithChildren, useReducer } from 'react'
import { AuthContext, authReducer } from './'
import { IUser } from '../../interfaces';


export interface AuthState extends PropsWithChildren {
    isLoggedIn: boolean;
    user?: IUser;
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
}


export const AuthProvider: FC<AuthState> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );

    return (
        <AuthContext.Provider value={{
            ...state,
        }}>
            { children }
        </AuthContext.Provider>
    )
};