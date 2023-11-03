import { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import NextLink from 'next/link';

import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models';

import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { authOptions } from '../api/auth/[...nextauth]';

interface Props {
    orders: Array<IOrder>;
}


/* The `columns` constant is an array of objects that define the columns for the DataGrid component.
Each object represents a column and has properties such as `field`, `headerName`, `width`, and
`renderCell`. */
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        width: 200,
        renderCell: ( params: GridRenderCellParams ) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: ( params: GridRenderCellParams ) => {
            return (
                <NextLink href={`/orders/${ params.row.orderId }`} passHref legacyBehavior >
                    <Link underline='always' >
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
    
]


/**
 * The HistoryPage component is a TypeScript React component that displays the history of orders for a
 * client.
 * @param  - - `orders`: An array of order objects, where each object has properties like `_id`,
 * `isPaid`, and `shippingAddress`.
 * @returns The component `HistoryPage` is being returned.
 */
const HistoryPage: NextPage<Props> = ({ orders }) => {

    const ordersToShow = useMemo(() => orders.map(({ _id, isPaid, shippingAddress }, i) => ({
        id: i + 1,
        orderId: _id,
        paid: isPaid,
        fullname: `${shippingAddress.firstName} ${shippingAddress.lastName}`
    })), [orders]);
    
    return (
        <ShopLayout title='Orders History' pageDescription='History of orders of Client' >
            <Typography variant='h1' component='h1' > Orders History </Typography>

            <Grid container sx={{ my: 2 }} className="fadeIn" >

                <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }} >
                    <DataGrid 
                        rows={ ordersToShow }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={[ 10 ]}
                    />
                </Grid>

            </Grid>

        </ShopLayout>
    )
}

/**
 * This function is a server-side function in a TypeScript React application that retrieves the user's
 * session, redirects to the login page if the session is not found, and retrieves the user's orders
 * from the database.
 * @param  - - `req`: The HTTP request object.
 * @returns The code is returning an object with the property "props" which contains the "orders" data.
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    
    const session: any = await getServerSession( req, res, authOptions );

    /* The code block is checking if the `session` object is falsy. If it is, it means that the user is
    not authenticated or the session has expired. In this case, the code returns a redirect object
    that redirects the user to the login page (`/auth/login`) with the `fromPage` query parameter
    set to `/orders/history`. This allows the login page to redirect the user back to the orders
    history page after successful authentication. The `permanent` property is set to `false` to
    indicate that this redirect is temporary. */
    if( !session ) {
        return {
            redirect: {
                destination: `/auth/login?fromPage=/orders/history`,
                permanent: false,
            }
        };
    };

    const orders = await dbOrders.getOrdersByUser( session.user._id );

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;