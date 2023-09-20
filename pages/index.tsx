import { Typography } from '@mui/material';
import { NextPage } from 'next'
import { ShopLayout } from '../components/layouts/';
import { ProductList } from '../components/products';
import { Loading } from '../components/ui';
import { useProducts } from '../hooks';



const HomePage: NextPage = () => {

    const { products, isLoading } = useProducts( '/products' );
    
    return (
        <ShopLayout title={'Teslo Shop'} pageDescription={'Encuentra los mejores productos de Teslo aquí!'} >

            <Typography variant='h1' component='h1' > Tienda </Typography>
            
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>

            {
                isLoading
                    ? <Loading />
                    : <ProductList products={ products } />
            }

        </ShopLayout>
    )
}

export default HomePage;