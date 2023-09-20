import { Typography } from '@mui/material';
import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts';
import { Loading } from '../../components/ui/Loading';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';


const CategoryMenPage: NextPage = () => {

    const { products, isLoading } = useProducts( '/products?gender=men' );
    
    return (
        <ShopLayout title={'Teslo Shop - Hombres'} pageDescription={'Productos exclusivos para hombres'} >
            
            <Typography variant='h1' component='h1' sx={{ mb: 1 }}> Hombres </Typography>

            {
                isLoading
                    ? <Loading />
                    : <ProductList products={ products } />
            }

        </ShopLayout>
    )
}

export default CategoryMenPage;