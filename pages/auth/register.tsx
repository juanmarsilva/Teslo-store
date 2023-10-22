import { useContext, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Grid, TextField, Typography, Link, Chip, InputAdornment } from '@mui/material';
import { AccountCircleOutlined, ErrorOutline, VisibilityOutlined, MailOutline } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts";
import { AuthContext } from '../../context';
import { Validations } from '../../utils';

/**
 * The above type represents the form data with fields for name, email, and password, all of which are
 * strings.
 * @property {string} name - A string representing the name of the user.
 * @property {string} email - The `email` property is a string that represents the email address of the
 * user.
 * @property {string} password - The `password` property in the `FormData` type represents a string
 * value that is used to store a user's password.
 */
type FormData = {
    name: string,
    email: string,
    password: string,
};


/* The above code is a TypeScript React component for a registration page. It uses Next.js for routing
and useContext and useForm hooks from React to handle form submission and validation. The component
renders a form with input fields for name, email, and password. It also includes error handling for
displaying error messages and redirects the user to a specified destination after successful
registration. */
const RegisterPage: NextPage = () => {

    const { query } = useRouter();
    
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const destination = query.fromPage?.toString() || '/';

    const onRegister = async ({ name, email, password }: FormData) => {

        setShowError(false);

        const { hasError, message } = await registerUser( name, email, password );

        if( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            return setTimeout(() => setShowError(false), 5000);
        }

        await signIn('credentials', { email, password });
    }

    return (
        <AuthLayout title='Ingresar' >
            <form onSubmit={ handleSubmit(onRegister) } noValidate >
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={ 2 }>

                        <Grid item xs={ 12 } >
                            <Typography variant='h1' component='h1' > Crear cuenta </Typography>
                        </Grid>

                        <Grid item xs={ 12 } >
                            <TextField 
                                label='Nombre completo' 
                                variant='outlined' 
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircleOutlined color='primary' />
                                        </InputAdornment>
                                    )
                                }}
                                {  ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                    }
                                }) }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>

                        <Grid item xs={ 12 } >
                            <TextField 
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
                                {  ...register('email', {
                                    required: 'Este campo es requerido',
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
                                {  ...register('password', {
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
                                label="Ya existe dicho usuario"
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                            />
                        </Grid>
                        
                        <Grid item xs={ 12 } >
                            <Button
                                type="submit"
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth 
                            >
                                Crear cuenta
                            </Button>
                        </Grid>

                        <Grid item xs={ 12 } display='flex' justifyContent='end' >
                            <NextLink 
                                href={`/auth/login?fromPage=${destination}`} 
                                passHref 
                                legacyBehavior 
                            >
                                <Link underline='always' >
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
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

export default RegisterPage;