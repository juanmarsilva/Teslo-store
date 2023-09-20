
import { Card, CardContent, Divider, Grid, Typography, Button } from '@mui/material';
import { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Box } from '@mui/system';
import { CartList, OrdenSummary } from '../../components/cart';


const ShoppingCartPage: NextPage = () => {
    return (
        <ShopLayout title='Shopping Cart' pageDescription='Shopping Cart' >
            
            <Typography variant='h1' component='h1'> Shopping Cart </Typography>

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
                                <Button color='secondary' className='circular-btn' fullWidth >
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