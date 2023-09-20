import { UIState } from './';

type UIActionType =
| { type: '[UI] - TOOGLE MENU' }


export const uiReducer = ( state: UIState, { type }: UIActionType ): UIState => {

    if( type === '[UI] - TOOGLE MENU' ) {
        return {
           ...state,
           isSideMenuOpen: !state.isSideMenuOpen,
        };
    };

    

    return state;
}