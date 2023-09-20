import { NextPage } from 'next';
import NextLink from 'next/link';
import { AuthLayout } from "../../components/layouts";
import { Box, Button, Grid, TextField, Typography, Link } from '@mui/material';

const RegisterPage: NextPage = () => {
    
    
    return (
        <AuthLayout title='Ingresar' >
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={ 2 }>

                    <Grid item xs={ 12 } >
                        <Typography variant='h1' component='h1' > Crear cuenta </Typography>
                    </Grid>

                    <Grid item xs={ 12 } >
                        <TextField label='Nombre completo' variant='outlined' fullWidth />
                    </Grid>

                    <Grid item xs={ 12 } >
                        <TextField label='Correo' variant='outlined' fullWidth />
                    </Grid>

                    <Grid item xs={ 12 } >
                        <TextField label='Contraseña' type='password' variant='outlined' fullWidth />
                    </Grid>
                    
                    <Grid item xs={ 12 } >
                        <Button color='secondary' className='circular-btn' size='large' fullWidth >
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
        </AuthLayout>
    )
}

export default RegisterPage;