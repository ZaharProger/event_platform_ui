import { configureStore } from '@reduxjs/toolkit'

import {defaultState} from './initialState'
import {defaultReducer} from './reducers.js'

export const defaultStore = configureStore({
     reducer: defaultReducer, 
     preloadedState: defaultState 
})