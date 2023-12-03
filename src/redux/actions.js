import {DATA, SELECTED_CARD_TAB, SHOW_COMPLETED_EVENTS, USER} from './constants'

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

export const changeSelectedCardTab = (selectedCardTab) => {
    return {
        type: SELECTED_CARD_TAB,
        selected_card_tab: selectedCardTab
    }
}