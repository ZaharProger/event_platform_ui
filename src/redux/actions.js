import {DATA, SHOW_COMPLETED_EVENTS, USER} from './constants'

export const changeData = (data) => {
    return {
        type: DATA,
        data
    }
}

export const changeUser = (user) => {
    return {
        type: USER,
        user
    }
}

export const changeShowCompletedEvents = (showCompletedEvents) => {
    return {
        type: SHOW_COMPLETED_EVENTS,
        show_completed_events: showCompletedEvents
    }
}