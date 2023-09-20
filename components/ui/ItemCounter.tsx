import { FC, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';


interface Props {
    currentValue: number;
    maxValue: number;

    // Methods
    onUpdateQuantity: ( quantity: number ) => void;
}


export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdateQuantity }) => {

    return (
        <Box display='flex' alignItems='center' >

            <IconButton
                onClick={ () => onUpdateQuantity( currentValue - 1 ) }
                disabled={ currentValue === 1 ? true : false }
            >
                <RemoveCircleOutline />
            </IconButton>

            <Typography sx={{ width: 40, textAlign: 'center' }}> { currentValue } </Typography>

            <IconButton
                onClick={ () => onUpdateQuantity( currentValue + 1 ) }
                disabled={ maxValue === currentValue ? true : false }
            >
                <AddCircleOutline />
            </IconButton>
            
        </Box>
    )
}
