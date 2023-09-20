import { Box, CircularProgress } from '@mui/material';


export const Loading = () => {
    
    return (
        <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)' 
            flexDirection='column'
        >

            <CircularProgress thickness={ 2 } color='secondary' size={ 50 } />
        
        </Box>
    )
}
