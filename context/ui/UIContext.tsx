import { createContext } from 'react';


interface ContextProps {
    isSideMenuOpen:  boolean;


    // Methods
    toogleSideMenu: () => void;
}


export const UIContext = createContext( {} as ContextProps );