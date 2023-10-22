import { useEffect, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

import { Box, Button, Grid, TextField, Typography, Link, InputAdornment, Chip, Divider } from '@mui/material';
import { ErrorOutline, MailOutline, VisibilityOutlined } from '@mui/icons-material';
import { useForm } from "react-hook-form";

import { AuthLayout } from "../../components/layouts";
import { Validations } from '../../utils';

/**
 * The type `FormData` represents an object with properties `email` and `password`, both of which are
 * of type `string`.
 * @property {string} email - A string representing the email address of a user.
 * @property {string} password - The `password` property is a string that represents the user's
 * password.
 */
type FormData = {
    email: string,
    password: string,
};



/* The code is defining a functional component called `LoginPage` using the `NextPage` type from
Next.js. */
const LoginPage: NextPage = () => {

    const { query } = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});

    const destination = query.fromPage?.toString() || '/';


    /**
        * The function `onLogin` is an asynchronous function that takes in an object with `email` and
        * `password` properties, and it calls the `signIn` function with the provided credentials.
        * @param {FormData}  - The `onLogin` function takes in an object with two properties: `email` and
        * `password`. These properties are of type `FormData`.
    */
    const onLogin = async ({ email, password }: FormData) => {
        setShowError(false);

        await signIn('credentials', { email, password });
    };

    useEffect(() => {
        getProviders()
            .then( prov => setProviders(prov) )
            .catch( error => console.log(error) );
    }, [])
    
    return (
        <AuthLayout title='Ingresar' >
            <form onSubmit={ handleSubmit(onLogin) } noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={ 2 }>

                        <Grid item xs={ 12 } >
                            <Typography variant='h1' component='h1' > Iniciar Sesión</Typography>
                        </Grid>


                        <Grid item xs={ 12 } >
                            <TextField
                                type='email'
                                label='Correo' 
                                variant='outlined' 
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutline color='primary' />
                                        </InputAdornment>
                                    )
                                }}
                                { ...register('email', {
                                    required: 'Este campo es requerido',
                                    // validate: (email) => Validations.isEmail(email),
                                    validate: Validations.isEmail,
                                }) }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={ 12 } >
                            <TextField 
                                label='Contraseña' 
                                type='password' 
                                variant='outlined' 
                                fullWidth 
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <VisibilityOutlined color='primary' />
                                        </InputAdornment>
                                    )
                                }}
                                { ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 6,
                                        message: 'Mínimo 6 caracteres'
                                    }
                                }) }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>
                            
                        <Grid 
                            item 
                            xs={12} 
                            display={ showError ? 'flex' : 'none' } 
                            justifyContent={'center'}
                        >
                            <Chip 
                                label="No reconocemos ese usuario / contraseña"
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                            />
                        </Grid>

                        <Grid item xs={ 12 } >
                            <Button 
                                type='submit'    
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                                disabled={!!errors.email || !!errors.password}
                            >
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={ 12 } display='flex' justifyContent='end' >
                            <NextLink 
                                href={`/auth/register?fromPage=${destination}`} 
                                passHref 
                                legacyBehavior 
                            >
                                <Link underline='always' >
                                    ¿No tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid 
                            item 
                            xs={ 12 } 
                            display='flex' 
                            flexDirection='column' 
                            justifyContent='end' 
                        >
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            {
                                Object.values(providers).map(({ name, id }: any) => {

                                    if( id === 'credentials' ) return (<div key={id} ></div>);

                                    return (
                                        <Button
                                            key={ id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={() => signIn(id)}
                                        >
                                            { name }
                                        </Button>
                                    )


                                })
                            }
                        </Grid>

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
};



/**
 * This function checks if a user is logged in and redirects them to a specified page if they are,
 * otherwise it returns an empty object.
 * @param  - - `req`: The incoming HTTP request object.
 * @returns The code is returning an object with either a "redirect" property or a "props" property. If
 * the "session" variable is truthy, it will return a "redirect" object with the "destination" set to
 * the value of "fromPage" and "permanent" set to false. If the "session" variable is falsy, it will
 * return a "props" object with an
 */
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });

    const { fromPage = '/' } = query;

    if( session ) {
        return {
            redirect: {
                destination: fromPage.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}

export default LoginPage;