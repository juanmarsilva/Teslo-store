import { NextPage, GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import NextLink from 'next/link'

import { 
    Box, 
    Card, 
    CardContent, 
    Divider, 
    Grid, 
    Typography, 
    Link, 
    Chip 
} from '@mui/material';
import { /* CreditCardOffOutlined, */ CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout, CartList, OrdenSummary } from '../../components';

import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


interface Props {
    order: IOrder
}

/* The code is defining a React functional component called `OrderPage`. It is a TypeScript component
that takes in a prop called `order` of type `IOrder`. */
const OrderPage: NextPage<Props> = ({ order }) => {

    console.log({ order });

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


export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    
    const { id = '' } = query;

    const session: any = await getServerSession(req, res, authOptions);

    /* This code block is checking if there is a valid session for the user. If there is no session, it
    means the user is not authenticated. In that case, it redirects the user to the login page with
    the `fromPage` query parameter set to the current order page. This allows the user to be
    redirected back to the order page after logging in. The `permanent` property is set to `false`,
    indicating that this redirect is temporary. */
    if( !session ) {
        return {
            redirect: {
                destination: `/auth/login?fromPage=/orders/${ id }`,
                permanent: false,
            }
        };
    };

    const order = await dbOrders.getOrderById( id.toString() );

    /* This code block is checking if the `order` variable is falsy, meaning it does not exist or is
    empty. If the `order` does not exist, it means that the requested order does not exist in the
    database. In this case, the code returns a redirect object with the `destination` property set
    to `/orders/history`, indicating that the user should be redirected to the order history page.
    The `permanent` property is set to `false`, indicating that this redirect is temporary. */
    if( !order ) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        };
    };

    /* This code block is checking if the `user` property of the `order` object is not equal to the
    `_id` property of the `user` object in the `session`. */
    if( order.user !== session.user._id ) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        };
    };

    return {
        props: {
            order,
        }
    }
}


export default OrderPage

