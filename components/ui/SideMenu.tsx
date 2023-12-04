import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { 
    Box, 
    Divider, 
    Drawer, 
    IconButton, 
    Input, 
    InputAdornment, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    ListSubheader, 
    ListItemButton 
} from "@mui/material";
import { 
    AccountCircleOutlined, 
    AdminPanelSettings, 
    CategoryOutlined, 
    ConfirmationNumberOutlined, 
    EscalatorWarningOutlined, 
    FemaleOutlined, 
    LoginOutlined, 
    MaleOutlined, 
    SearchOutlined, 
    VpnKeyOutlined 
} from "@mui/icons-material";

import { AuthContext, UIContext } from '../../context';

export const SideMenu = () => {

    const { push, asPath } = useRouter()

    const { isSideMenuOpen, toogleSideMenu } = useContext( UIContext );
    const { user, isLoggedIn, logOut } = useContext( AuthContext );

    const [ searchTerm, setSearchTerm ] = useState('');

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;

        navigateTo(`/search/${ searchTerm }`);
    };

    const navigateTo = ( url: string ) => {
        toogleSideMenu();
        push( url );
    };

    return (
        <Drawer
            open={ isSideMenuOpen }
            onClose={ toogleSideMenu }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm( e.target.value ) }
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ onSearchTerm }
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>
                    
                    {
                        isLoggedIn && (
                            <>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItemButton>

                                <ListItemButton onClick={() => navigateTo('/orders/history')} >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItemButton>
                            </>
                        )
                    }

                    <ListItemButton 
                        sx={{ display: { xs: '', sm: 'none' } }} 
                        onClick={() => navigateTo('/category/men') } 
                    >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>

                    <ListItemButton 
                        sx={{ display: { xs: '', sm: 'none' } }} 
                        onClick={() => navigateTo('/category/women') }
                    >
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton 
                        sx={{ display: { xs: '', sm: 'none' } }} 
                        onClick={() => navigateTo('/category/kid') }
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>

                    {
                        !isLoggedIn
                        ?   (
                            <ListItemButton onClick={() => navigateTo(`/auth/login?fromPage=${ asPath }`)} >
                                <ListItemIcon>
                                    <VpnKeyOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItemButton>
                        )
                        : (
                            <ListItemButton onClick={logOut} >
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItemButton>
                        )
                    }

                    {
                        user?.role === 'admin' && (
                            <>
                                {/* Admin */}
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItemButton>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItemButton>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <AdminPanelSettings/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItemButton>
                            </>
                        )
                    }
                </List>
            </Box>
        </Drawer>
    )
}