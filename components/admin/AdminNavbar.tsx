import { useContext } from 'react';

import NextLink from 'next/link';

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"

import { UIContext } from '../../context';

export const AdminNavbar = () => {

    const { toogleSideMenu } = useContext( UIContext );

    return (
        <AppBar>
            <Toolbar>
                
                <NextLink href='/' passHref legacyBehavior >
                    <Link display='flex' alignItems='center' >
                        <Typography variant='h6'> Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}> Shop </Typography>
                    </Link>
                </NextLink>

                <Box flex={ 1 } />

                <Button onClick={ toogleSideMenu } >
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
