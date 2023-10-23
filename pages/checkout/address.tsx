import { useCallback, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
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
import { getSession } from 'next-auth/react';


/**
 * The above code defines a TypeScript interface `FormData` and a function `getAddressFromCookies` that
 * retrieves address information from cookies and returns it as a `FormData` object.
 * @property {string} firstName - The first name of the person.
 * @property {string} lastName - The `lastName` property represents the last name of the person.
 * @property {string} address - The `address` property in the `FormData` object represents the street
 * address of the user.
 * @property {string} address2 - The `address2` property is an optional property in the `FormData`
 * object. It represents an additional address line, such as an apartment number or suite number.
 * @property {string} zipCode - A string representing the zip code of the address.
 * @property {string} country - The `country` property represents the country of the address.
 * @property {string} province - The `province` property in the `FormData` object represents the
 * province or state of the address.
 * @property {string} city - The `city` property represents the city of the address.
 * @property {string} phone - The `phone` property in the `FormData` object represents the phone number
 * associated with the address.
 */
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

/**
 * The function `getAddressFromCookies` retrieves address information from cookies and returns it as a
 * `FormData` object.
 */
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
    

/* The above code is a TypeScript React component for an address page in a shopping application. It
allows users to enter their shipping address information. */
const AddressPage: NextPage = () => {
    const { push } = useRouter();
    const { updateShippingAddress } = useContext( CartContext );
    const [countryValue, setCountryValue] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAdressFromCookies(),
    });

    const onSubmit = useCallback((data: FormData) => {
        updateShippingAddress( data );
        push('/checkout/summary');
    }, [push, updateShippingAddress]);

    useEffect(() => {
        if( Cookies.get('country') ) {
            setCountryValue( Cookies.get('country')! );
        };
    }, []);

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
                                key={countryValue}
                                select
                                variant='outlined'
                                label='Country'
                                { ...register('country', {
                                    required: 'Este campo es requerido',
                                }) }
                                error={ !!errors.country }
                                helperText={ errors.country?.message }
                                defaultValue={countryValue}
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


/**
 * The above function is a server-side function in a TypeScript React application that checks if a user
 * is authenticated and redirects them to the login page if they are not.
 * @param  - - `getServerSideProps`: This is a function that is used in Next.js to fetch data on the
 * server side before rendering a page. It is a special function that is exported from a page component
 * and is executed on the server side.
 * @returns The code is returning an object with the property `redirect` if there is no session. If
 * there is a session, it returns an object with an empty `props` property.
 */
export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req });

    if( !session ) {
        return {
            redirect: {
                destination: '/auth/login?fromPage=/checkout/address',
                permanent: false,
            }
        };
    }

    return {
        props: {}
    }
}

export default AddressPage;