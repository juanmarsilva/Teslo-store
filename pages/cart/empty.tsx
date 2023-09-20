
import { NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Typography, Link } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { ShopLayout } from '../../components/layouts';

const EmptyPage: NextPage = () => {


    return (
        <ShopLayout title='Empty Cart' pageDescription='There is no items in shopping cart' >

            <Box 
                display='flex' 
                justifyContent='center' 
                alignItems='center' 
                height='calc(100vh - 200px)' 
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <RemoveShoppingCartOutlined sx={{ fontSize: 80 }}/>

                <Box display='flex' flexDirection='column' alignItems='center' >

                    <Typography> Your shopping cart is empty </Typography>

                    <NextLink href='/' passHref legacyBehavior >
                        <Link typography='h5' color='secondary' >
                            Go home
                        </Link>
                    </NextLink>

                </Box>

            </Box>

        </ShopLayout>
    )
}

export default EmptyPage;