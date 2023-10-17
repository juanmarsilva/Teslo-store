import { useContext, useMemo } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';

import { Box, Card, CardContent, Divider, Grid, Typography, Button, Link } from '@mui/material';

import { ShopLayout, CartList, OrdenSummary } from '../../components/';
import { CartContext } from '../../context';
import { countries } from '../../utils';

const SummaryPage: NextPage = () => {

    const { shippingAddress, numberOfItems } = useContext( CartContext );

    if( !shippingAddress ) return <></>;

    const {
        firstName,
        lastName,
        address,    
        address2,
        country, 
        province,   
        city,
        phone,      
    } = shippingAddress;

    return (
        <ShopLayout title='Order summary' pageDescription='Order summary' >
            
            <Typography variant='h1' component='h1'> Order summary </Typography>

            <Grid container >
                <Grid item xs={ 12 } sm={ 7 } >

                    <CartList editable={ false } />

                </Grid>

                <Grid item xs={ 12 } sm={ 5 } >

                    <Card className='summary-card' >

                        <CardContent>

                            <Typography variant='h2' > 
                                Summary: ({numberOfItems} { numberOfItems > 1 ? 'products' : 'product' }) 
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between' >
                                <Typography variant='subtitle1'> Delivery address </Typography>

                                <NextLink href='/checkout/address' passHref legacyBehavior >
                                    <Link underline='always' >
                                        Edit
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography> { firstName } { lastName } </Typography>               
                                
                            <Typography> { address }{ address2 ? `, ${address2}` : '' } </Typography>

                            <Typography> { city }, { province } </Typography>

                            <Typography> { countries.find(c => c.code === country)?.name } </Typography>

                            <Typography> { phone } </Typography>

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
                                <Button color='secondary' className='circular-btn' fullWidth >
                                    Confirm order
                                </Button>
                            </Box>

                        </CardContent>

                    </Card>

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default SummaryPage