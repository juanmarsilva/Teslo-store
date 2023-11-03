import { FC, useContext } from "react"
import { Grid, Typography } from "@mui/material"

import { CartContext } from "../../context"
import { Currency } from "../../utils";
import { IOrder } from "../../interfaces";

interface Props {
    order?: IOrder;
}

export const OrdenSummary: FC<Props> = ({ order }) => {

    const { numberOfItems, subtotal, total, tax } = useContext( CartContext );

    const orderToShow = order ? order : { numberOfItems, subtotal, total, tax };

    return (
        <Grid container >
            <Grid item xs={ 6 } >
                
                <Typography> N° Products </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography> 
                    { orderToShow.numberOfItems } { orderToShow.numberOfItems > 1 ? 'Items' : 'Item' } 
                </Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Subtotal </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>{ Currency.format(orderToShow.subtotal) } </Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%) </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>{ Currency.format(orderToShow.tax) }</Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} >
                
                <Typography variant='subtitle1' > Total </Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end' >

                <Typography variant='subtitle1'>{ Currency.format(orderToShow.total) }</Typography>

            </Grid>
        </Grid>
    )
}
