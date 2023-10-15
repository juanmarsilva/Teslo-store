import { useContext, useState } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { Box, Button, Grid, TextField, Typography, Link, Chip, InputAdornment } from '@mui/material';
import { AccountCircleOutlined, ErrorOutline, VisibilityOutlined, MailOutline } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts";
import { AuthContext } from '../../context';
import { Validations } from '../../utils';

type FormData = {
    name: string,
    email: string,
    password: string,
};


const RegisterPage: NextPage = () => {

    const { replace } = useRouter();
    
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegister = async ({ name, email, password }: FormData) => {

        setShowError(false);

        const { hasError, message } = await registerUser( name, email, password );

        if( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            return setTimeout(() => setShowError(false), 5000);
        }

        replace('/');
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
                            <NextLink href='/auth/login' passHref legacyBehavior >
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
}

export default RegisterPage;