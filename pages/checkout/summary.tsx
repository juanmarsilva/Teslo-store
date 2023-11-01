import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Cookies from 'js-cookie';

import { 
    Box, 
    Card, 
    CardContent, 
    Divider, 
    Grid, 
    Typography, 
    Button, 
    Link,
    Chip,
} from '@mui/material';

import { ShopLayout, CartList, OrdenSummary } from '../../components/';
import { CartContext } from '../../context';
import { countries } from '../../utils';

/* The code defines a functional component called `SummaryPage` which is a Next.js page component. It
imports necessary dependencies from various libraries and components. */
const SummaryPage: NextPage = () => {

    const { push, replace } = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext );
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if(!Cookies.get('firstName')) push('/checkout/address');
    }, [push]);

    const onCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, message } = await createOrder();

        if( hasError ) {
            setIsPosting(false);
            setErrorMessage( message );
            return;
        }

        replace(`/orders/${ message }`);
    };

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

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrder }
                                    disabled={ isPosting }
                                >
                                    Confirm order
                                </Button>

                                <Chip 
                                    color='error'
                                    label={ errorMessage }
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 1 }}
                                    variant='outlined'
                                />

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export default SummaryPage