import { useState } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';

import { useForm } from 'react-hook-form';
import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts";
import { Validations } from '../../utils';
import { TesloApi } from '../../api';

type FormData = {
    name: string,
    email: string,
    password: string,
};


const RegisterPage: NextPage = () => {
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const onRegister = async ({ name, email, password }: FormData) => {
        try {

            const { data } = await TesloApi.post('/user/register', { name, email, password });

            const { token, user } = data;

            console.log({ token, user });

        } catch(error) {
            console.log('Error en las credenciales.');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
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