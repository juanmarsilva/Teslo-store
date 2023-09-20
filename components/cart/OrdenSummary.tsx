import { Grid, Typography } from "@mui/material"



export const OrdenSummary = () => {
    return (
        <Grid container >
            <Grid item xs={ 6 } >
                
                <Typography> N° Products </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography> 3 Items </Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Subtotal </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>$155.36</Typography>

            </Grid>
            <Grid item xs={ 6 } >
                
                <Typography> Impuestos (7.5%) </Typography>

            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end' >

                <Typography>$33.36</Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} >
                
                <Typography variant='subtitle1' > Total </Typography>

            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end' >

                <Typography>$195.36</Typography>

            </Grid>
        </Grid>
    )
}
