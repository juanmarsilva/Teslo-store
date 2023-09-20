import { Typography } from '@mui/material';
import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts';
import { Loading } from '../../components/ui/Loading';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';


const CategoryKidPage: NextPage = () => {

    const { products, isLoading } = useProducts( '/products?gender=kid' );
    
    return (
        <ShopLayout title={'Teslo Shop - Niños'} pageDescription={'Productos exclusivos para niños'} >
            
            <Typography variant='h1' component='h1' sx={{ mb: 1 }}> Niños </Typography>

            {
                isLoading
                    ? <Loading />
                    : <ProductList products={ products } />
            }

        </ShopLayout>
    )
}

export default CategoryKidPage;