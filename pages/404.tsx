import { Box, Typography } from '@mui/material';
import { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';

const Custom404Page: NextPage = () => {



    return (
        <ShopLayout title='Page not found' pageDescription='No hay nada que mostrar aquí'>

            <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >

                <Typography variant='h1' component='h1' fontSize={ 35 } fontWeight={ 80 } > 404 | </Typography>
                
                <Typography marginLeft={ 2 } > Page not found </Typography>

            </Box>

        </ShopLayout>
    )
}

export default Custom404Page;