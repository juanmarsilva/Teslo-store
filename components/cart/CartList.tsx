import NextLink from 'next/link';
import { Grid, Typography, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { initialData } from "../../database/products"
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces';



interface Props {
    editable: boolean;
}


export const CartList: FC<Props> = ({ editable }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext( CartContext );

    const updateProductQuantity = ( product: ICartProduct, newQuantity: number ) => {
        product.quantity = newQuantity;
        updateCartQuantity(product);
    }
    
    return (
        <>
            {
                cart.map(({ image, price, _id, inStock, size, slug, title, quantity }, index)=> (
                    <Grid container spacing={ 2 } sx={{ mb: 1 }} key={ slug + size } >

                        <Grid item xs={ 3 } >
                            {/* TODO: LLevar a la pagina del producto */}
                            <NextLink href={`/product/${slug}`} passHref legacyBehavior >
                                <Link>
                                    <CardActionArea>
                                        <CardMedia 
                                            image={`/products/${image}`}
                                            component='img'
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={ 7 } >
                            <Box display='flex' flexDirection='column' >

                                <Typography variant='body1' >{ title }</Typography>

                                <Typography variant='body1' > Size: <strong>{size}</strong></Typography>

                                {
                                    editable
                                    ? (
                                        <ItemCounter 
                                            currentValue={ quantity } 
                                            maxValue={ inStock } 
                                            onUpdateQuantity={( value ) => updateProductQuantity(cart[index], value)}     
                                        />
                                    )
                                    : <Typography variant='h5' >{ quantity } { quantity > 1 ? 'productos' : 'producto' } </Typography>
                                }
                                
                            </Box>
                        </Grid>

                        <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column' >

                            <Typography variant='subtitle1' >${ price }</Typography>
                            
                            {
                                editable && (
                                    <Button 
                                        variant='text' 
                                        color='secondary' 
                                        onClick={() => removeCartProduct(cart[index])}
                                    >
                                        Remove
                                    </Button>
                                )
                            }
                        
                        </Grid>
                    </Grid>    
                ))
            }
        </>
    )
}
