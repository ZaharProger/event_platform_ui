import { defaultState } from "./initialState"
import {DATA, TRIGGER, SELECTED_CARD_TAB, 
    SHOW_COMPLETED_EVENTS, USER, USERS_SIDE_TASKS_IDS, ASSIGNATION_LIST, ASSIGNATION_FLAG} from './constants'

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
        case USERS_SIDE_TASKS_IDS:
            return {
                ...state,
                users_side_tasks_ids: action.users_side_tasks_ids
            }
        case ASSIGNATION_LIST:
            return {
                ...state,
                assignation_list: action.assignation_list
            }
        case ASSIGNATION_FLAG:
            return {
                ...state,
                assignation_flag: action.assignation_flag
            }
        default:
            return state
    }
}