import { configureStore } from '@reduxjs/toolkit'

import {defaultState} from './initialState'
import {defaultReducer} from './reducer.js'

export const defaultStore = configureStore({
     reducer: defaultReducer, 
     preloadedState: defaultState 
})