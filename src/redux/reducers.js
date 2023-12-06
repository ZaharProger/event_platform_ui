import { defaultState } from "./initialState"
import {DATA, TRIGGER, SELECTED_CARD_TAB, SHOW_COMPLETED_EVENTS, USER} from './constants'

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
        case SELECTED_CARD_TAB:
            return {
                ...state,
                selected_card_tab: action.selected_card_tab
            }
        case TRIGGER:
            return {
                ...state,
                trigger: action.trigger
            }
        default:
            return state
    }
}