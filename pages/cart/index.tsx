
import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Card, CardContent, Divider, Grid, Typography, Button, Box, CircularProgress } from '@mui/material';

import { ShopLayout, CartList, OrdenSummary } from '../../components/';
import { CartContext } from '../../context';

const ShoppingCartPage: NextPage = () => {

    const { isLoaded, cart } = useContext( CartContext );
    const { replace } = useRouter();

    useEffect(() => {
        if(isLoaded && cart.length === 0) {
            replace('/cart/empty');
        }
    }, [isLoaded, cart, replace]);
    
    if( !isLoaded || cart.length === 0 ) return <></>;

    return (
        <ShopLayout title='Carrito de compras' pageDescription='Carrito de compras' >
          
            <Typography variant='h1' component='h1'> Carrito de compras </Typography>

            <Grid container >
                <Grid item xs={ 12 } sm={ 7 } >

                    <CartList editable />

                </Grid>

                <Grid item xs={ 12 } sm={ 5 } >

                    <Card className='summary-card' >

                        <CardContent>

                            <Typography variant='h2' > Orden </Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrdenSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    color='secondary'
                                    className='circular-btn'
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Chekout
                                </Button>
                            </Box>

                        </CardContent>

                    </Card>

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default ShoppingCartPage