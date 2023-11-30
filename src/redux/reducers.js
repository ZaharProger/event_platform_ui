import { defaultState } from "./initialState"
import {DATA, SHOW_COMPLETED_EVENTS, USER} from './constants'

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
        case SHOW_COMPLETED_EVENTS:
            return {
                ...state,
                show_completed_events: action.show_completed_events
            }
        default:
            return state
    }
}