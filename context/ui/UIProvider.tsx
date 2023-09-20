import { FC, useReducer } from 'react';
import { UIContext, uiReducer } from './';


export interface UIState {
    isSideMenuOpen: boolean;
}

interface Props {
    children?: JSX.Element | JSX.Element[];
}

const UI_INITIAL_STATE: UIState = {
   isSideMenuOpen: false,
}

export const UIProvider: FC<Props> = ({ children }) => {

    const [ state, dispatch ] = useReducer( uiReducer, UI_INITIAL_STATE );

    const toogleSideMenu = () => dispatch({ type: '[UI] - TOOGLE MENU' });


   return (
        <UIContext.Provider value={{ 
            ...state,


            // Methods
            toogleSideMenu,
        
        }}>

            { children }
            
        </UIContext.Provider>
    )
}