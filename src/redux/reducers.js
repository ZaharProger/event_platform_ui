import { defaultState } from "./initialState"
import {DATA, TRIGGER, SELECTED_CARD_TAB, 
    SHOW_COMPLETED_EVENTS, USER, USERS_SIDE_TASKS_IDS, 
    ASSIGNATION_LIST, ASSIGNATION_FLAG, FILTER_USERS, 
    FILTER_STATES, NESTED_TASK, MONEY_TOTAL} from './constants'

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
        case FILTER_USERS:
            return {
                ...state,
                filter_users: action.filter_users
            }
        case FILTER_STATES:
            return {
                ...state,
                filter_states: action.filter_states
            }
        case NESTED_TASK:
            return {
                ...state, 
                nested_task: action.nested_task
            }
        case MONEY_TOTAL:
            return {
                ...state,
                money_total: action.money_total
            }
        default:
            return state
    }
}