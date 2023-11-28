import { defaultState } from "./initialState"
import {DATA, USER} from './constants'

export function defaultReducer(state=defaultState, action) {
    switch(action.type) {
        case DATA:
            return {
                ...state,
                data: action.data
            }
        case USER:
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}