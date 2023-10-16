import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { NextPage, GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Jwt } from '../../utils';

const AddressPage: NextPage = () => {
    return (
        <ShopLayout title='Direction' pageDescription='Confirm destiny direction' >

            <Typography variant='h1' component='h1'> Direction </Typography>

            <Grid container spacing={ 2 } sx={{ mt: 2 }} >

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Name' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Lastname' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Direction' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Direction 2 (optional)' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Postal Code' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='City' variant='filled' fullWidth />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <FormControl fullWidth >
                        
                        <Select
                            variant='filled'
                            label='Country'
                            value={ 1 }
                        >
                            <MenuItem value={ 1 }> Argentina </MenuItem>
                            <MenuItem value={ 2 }> Brasil </MenuItem>
                            <MenuItem value={ 3 }> Chile </MenuItem>
                            <MenuItem value={ 4 }> Uruguay </MenuItem>
                        </Select>

                    </FormControl>
                </Grid>

                <Grid item xs={ 12 } sm={ 6 } >
                    <TextField label='Province/State' variant='filled' fullWidth />
                </Grid>

            </Grid>

            <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                <Button color='secondary' className='circular-btn' size='large' >
                    Review order
                </Button>
            </Box>

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await Jwt.isValidToken( token );

//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if( !isValidToken ) {
//         return {
//             redirect: {
//                 destination: '/auth/login?fromPage=/checkout/address',
//                 permanent: false,
//             }
//         };
//     };

//     return {
//         props: {
            
//         }
//     }
// }

export default AddressPage;