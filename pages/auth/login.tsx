import { useState } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useForm } from "react-hook-form";

import { Box, Button, Grid, TextField, Typography, Link, InputAdornment, Chip } from '@mui/material';
import { AccountCircleOutlined, ErrorOutline, VisibilityOutlined } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts";
import { Validations } from '../../utils';
import { TesloApi } from '../../api';

type FormData = {
    email: string,
    password: string,
};


const LoginPage: NextPage = () => {
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const onLogin = async ({ email, password }: FormData) => {
        
        try {

            const { data } = await TesloApi.post('/user/login', { email, password });

            const { token, user } = data;

            console.log({ token, user });
            
        } catch(error) {
            console.log('Error en las credenciales.');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }

        // Todo: navegar a la pantalla donde se encontraba el usuario.

    }
    
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
                                        <AccountCircleOutlined color='primary' />
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
                            <NextLink href='/auth/register' passHref legacyBehavior >
                                <Link underline='always' >
                                    ¿No tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;