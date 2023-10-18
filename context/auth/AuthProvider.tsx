import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import axios from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './'

import { IUser } from '../../interfaces';
import TesloApi from '../../api/tesloApi';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}


export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const { data, status } = useSession();
    const { reload } = useRouter();

    useEffect(() => {
        if( status === 'authenticated' ) {
            // dispatch({ type: '[AUTH] - LOGIN', payload: data.user as IUser })
            console.log({ user: data.user });
            
        } 
    }, [status, data?.user])
    

    // useEffect(() => {
    //     checkToken();
    // }, []);

    // const checkToken = async () => {

    //     if( !Cookies.get('token') ) return;

    //     try {
    //         const  { data } = await TesloApi.get('/user/validate-token');

    //         const { token, user } = data;

    //         Cookies.set('token', token);

    //         dispatch({ type: '[AUTH] - LOGIN', payload: user });
    //     } catch(error) {
    //         Cookies.remove('token');
    //     }
    // };
    
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

    const logOut = () => {
        Cookies.remove('token');
        Cookies.remove('cart');
        Cookies.remove('firstName');
        Cookies.remove('lastName',);
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zipCode');
        Cookies.remove('country');
        Cookies.remove('province')
        Cookies.remove('city');
        Cookies.remove('phone');
        reload();
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