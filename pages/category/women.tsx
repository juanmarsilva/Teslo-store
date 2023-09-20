import { Typography } from '@mui/material';
import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts';
import { Loading } from '../../components/ui/Loading';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';


const CategoryWomenPage: NextPage = () => {

    const { products, isLoading } = useProducts( '/products?gender=women' );
    
    return (
        <ShopLayout title={'Teslo Shop - Mujeres'} pageDescription={'Productos exclusivos para mujeres'} >
            
            <Typography variant='h1' component='h1' sx={{ mb: 1 }}> Mujeres </Typography>

            {
                isLoading
                    ? <Loading />
                    : <ProductList products={ products } />
            }

        </ShopLayout>
    )
}

export default CategoryWomenPage;