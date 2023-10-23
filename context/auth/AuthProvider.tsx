import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { useSession, signOut } from 'next-auth/react';

import axios from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './'

import { IUser } from '../../interfaces';
import TesloApi from '../../api/tesloApi';


/* The `export interface AuthState` is defining the shape of the authentication state object used in
the `AuthProvider` component. It specifies that the `AuthState` object should have two properties: */
export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

/* `const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}` is initializing the initial state for the authentication context. */
const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

/**
 * The `AuthProvider` component is a TypeScript React component that provides authentication
 * functionality, including login, registration, and logout, to its child components.
 * @param  - - `children`: The child components that will be wrapped by the `AuthProvider` component.
 * @returns The `AuthProvider` component is being returned.
 */
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const { data, status } = useSession();

    useEffect(() => {
        if( status === 'authenticated' ) {
            dispatch({ type: '[AUTH] - LOGIN', payload: data.user as IUser })
        } 
    }, [status, data?.user]);
    
    /**
     * The function loginUser is an asynchronous function that takes an email and password as
     * parameters, sends a login request to the TesloApi, and returns a promise that resolves to true
     * if the login is successful and false otherwise.
     * @param {string} email - The email parameter is a string that represents the user's email
     * address.
     * @param {string} password - The password parameter is a string that represents the user's
     * password.
     * @returns The `loginUser` function returns a Promise that resolves to a boolean value. It returns
     * `true` if the login is successful and `false` if there is an error.
     */
    const loginUser = async (email: string, password: string): Promise<boolean> => {
        
        try {

            const { data } = await TesloApi.post('/user/login', { email, password });
            
            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: '[AUTH] - LOGIN', payload: user });

            return true;

        } catch(error) {
            return false;
        }

    };

    /**
     * The function `registerUser` is an asynchronous function that registers a user by making a POST
     * request to the `/user/register` endpoint, and returns a promise that resolves to an object
     * indicating whether the registration was successful or not.
     * @param {string} name - The name of the user being registered.
     * @param {string} email - The email parameter is a string that represents the user's email
     * address.
     * @param {string} password - The password parameter is a string that represents the user's
     * password.
     * @returns The function `registerUser` returns a Promise that resolves to an object with two
     * properties: `hasError` and `message`. The `hasError` property is a boolean indicating whether an
     * error occurred during the registration process. The `message` property is an optional string
     * that provides additional information about the error, if any.
     */
    const registerUser = async (
        name: string, 
        email: string, 
        password: string,
    ): Promise<{
        hasError: boolean, 
        message?: string 
    }> => {

        try {

            const { data } = await TesloApi.post('/user/register', { email, password, name });
            
            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: '[AUTH] - LOGIN', payload: user });

            return {
                hasError: false,
            }

        } catch(error) {
            if( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                }
            };

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo',
            };
        }


    };

    
    /**
     * The function `logOut` removes specific cookies and calls the `signOut` function.
     */
    const logOut = () => {
        Cookies.remove('firstName');
        Cookies.remove('lastName',);
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zipCode');
        Cookies.remove('country');
        Cookies.remove('province')
        Cookies.remove('city');
        Cookies.remove('phone');
        signOut();
    };


    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logOut,
        }}>
            { children }
        </AuthContext.Provider>
    )
};