import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models';


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
                <NextLink href={`/orders/${ params.row.id }`} passHref legacyBehavior >
                    <Link underline='always' >
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
    
]

const rows = [
    { id: 1, paid: true, fullname: 'Juan Martin Silva' },
    { id: 2, paid: false, fullname: 'Fernando Herrera' },
    { id: 3, paid: true, fullname: 'Bernardita Badano' },
    { id: 4, paid: false, fullname: 'Carlos Martin Silva' },
    { id: 5, paid: true, fullname: 'Monica Sexauer' },
]

const HistoryPage = () => {
    
    
    return (
        <ShopLayout title='Orders History' pageDescription='History of orders of Client' >
            <Typography variant='h1' component='h1' > Orders History </Typography>

            <Grid container sx={{ my: 2 }}>

                <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }} >
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={[ 10 ]}
                    />
                </Grid>



            </Grid>

        </ShopLayout>
    )
}

export default HistoryPage;