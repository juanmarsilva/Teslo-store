import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { 
    Box, 
    Button, 
    FormControl, 
    Grid, 
    MenuItem, 
    TextField, 
    Typography,
} from '@mui/material';

import { ShopLayout } from '../../components';
import { countries } from '../../utils';
import { CartContext } from '../../context';


type FormData = {
    firstName:  string;
    lastName:   string;
    address:    string;
    address2?:  string;
    zipCode:    string;
    country:    string;
    province:   string;
    city:       string;
    phone:      string;
};

const getAdressFromCookies = (): FormData => ({
    firstName: Cookies.get('firstName') || '', 
    lastName: Cookies.get('lastName') || '',  
    address: Cookies.get('address') || '',   
    address2: Cookies.get('address2') || '',  
    zipCode: Cookies.get('zipCode') || '',   
    country: Cookies.get('country') || countries[0].code,   
    province: Cookies.get('province') || '',  
    city: Cookies.get('city') || '',      
    phone: Cookies.get('phone') || '',   
});
    

const AddressPage: NextPage = () => {
    const { push } = useRouter();
    const { updateShippingAddress } = useContext( CartContext )

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAdressFromCookies(),
    });

    const onSubmit = (data: FormData) => {
        updateShippingAddress( data );
        push('/checkout/summary');
    };

    return (
        <ShopLayout title='Direction' pageDescription='Confirm destiny direction' >

            <form onSubmit={handleSubmit(onSubmit)}>

                <Typography variant='h1' component='h1'> Direction </Typography>

                <Grid container spacing={ 2 } sx={{ mt: 2 }} >

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Name'
                            variant='outlined' 
                            fullWidth
                            { ...register('firstName', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Lastname' 
                            variant='outlined' 
                            fullWidth
                            { ...register('lastName', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField
                            type='tel'
                            label='Phone' 
                            variant='outlined' 
                            fullWidth
                            { ...register('phone', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Direction' 
                            variant='outlined' 
                            fullWidth
                            { ...register('address', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Direction 2 (optional)' 
                            variant='outlined' 
                            fullWidth
                            { ...register('address2') }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <FormControl fullWidth >

                            <TextField
                                select
                                variant='outlined'
                                label='Country'
                                { ...register('country', {
                                    required: 'Este campo es requerido',
                                }) }
                                error={ !!errors.country }
                                helperText={ errors.country?.message }
                            >
                                {
                                    countries.map(({ name, code }) => 
                                        <MenuItem value={code} key={code} > { name } </MenuItem>)
                                }
                            </TextField>

                        </FormControl>
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Province/State' 
                            variant='outlined' 
                            fullWidth
                            { ...register('province', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.province }
                            helperText={ errors.province?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='City' 
                            variant='outlined' 
                            fullWidth
                            { ...register('city', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField 
                            label='Postal Code' 
                            variant='outlined' 
                            fullWidth
                            { ...register('zipCode', {
                                required: 'Este campo es requerido',
                            }) }
                            error={ !!errors.zipCode }
                            helperText={ errors.zipCode?.message }
                        />
                    </Grid>


                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                    <Button 
                        type='submit' 
                        color='secondary' 
                        className='circular-btn' 
                        size='large'
                    >
                        Review order
                    </Button>
                </Box>
            </form>

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