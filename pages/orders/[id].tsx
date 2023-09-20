import { NextPage } from 'next';
import NextLink from 'next/link'
import { Box, Card, CardContent, Divider, Grid, Typography, Button, Link, Chip } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrdenSummary } from '../../components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage: NextPage = () => {
    return (
        <ShopLayout title='Order summary 542' pageDescription='Order summary' >
            
            <Typography variant='h1' component='h1'> Order: 542 </Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label='Outstanding'
                variant='outlined'
                color='error'
                icon={ <CreditCardOffOutlined /> }
            /> */}

            <Chip
                sx={{ my: 2 }}
                label='Paid'
                variant='outlined'
                color='success'
                icon={ <CreditScoreOutlined /> }
            />

            <Grid container >
                <Grid item xs={ 12 } sm={ 7 } >

                    <CartList editable={ false } />

                </Grid>

                <Grid item xs={ 12 } sm={ 5 } >

                    <Card className='summary-card' >

                        <CardContent>

                            <Typography variant='h2' > Summary: (3 products ) </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between' >
                                <Typography variant='subtitle1'> Delivery address </Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior >
                                    <Link underline='always' >
                                        Edit
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography> Juan Martin Silva </Typography>
                            <Typography> 31 - 803 </Typography>
                            <Typography> Mercedes, Buenos Aires </Typography>
                            <Typography> Argentina </Typography>
                            <Typography> +54 9 2324 498482 </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end' >
                                <NextLink href='/cart' passHref legacyBehavior >
                                    <Link underline='always' >
                                        Edit
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrdenSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* TODO */}
                                <h1>Pagar</h1>

                                <Chip
                                    sx={{ my: 2 }}
                                    label='Paid'
                                    variant='outlined'
                                    color='success'
                                    icon={ <CreditScoreOutlined /> }
                                />
                            </Box>

                        </CardContent>

                    </Card>

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default OrderPage

