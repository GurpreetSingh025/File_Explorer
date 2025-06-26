import {configureStore} from '@reduxjs/toolkit' ;
import SidebarReducer from './slices/SidebarDataSlice' ;

const store = configureStore({ reducer: {
   sidebar : SidebarReducer
}})

export default store