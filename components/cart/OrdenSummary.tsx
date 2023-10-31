import { useContext } from "react"
import { Grid, Typography } from "@mui/material"

import { CartContext } from "../../context"
import { Currency } from "../../utils";



export const OrdenSummary = () => {

    const { numberOfItems, subtotal, total, tax } = useContext( CartContext );

    return (
        <Grid container >
            <Grid item xs={ 6 } >
                
                <Typography> N° Products </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography> { numberOfItems } { numberOfItems > 1 ? 'Items' : 'Item' } </Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Subtotal </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>{ Currency.format(subtotal) } </Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%) </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>{ Currency.format(tax) }</Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} >
                
                <Typography variant='subtitle1' > Total </Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end' >

                <Typography variant='subtitle1'>{ Currency.format(total) }</Typography>

            </Grid>
        </Grid>
    )
}
