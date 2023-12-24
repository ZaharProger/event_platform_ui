import {DATA, TRIGGER, SELECTED_CARD_TAB, SHOW_COMPLETED_EVENTS, USER, ASSIGNED_USERS, WRAPPED_TASK_ID} from './constants'

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

export const changePrevTrigger = (prevTrigger) => {
    return {
        type: TRIGGER,
        trigger: prevTrigger
    }
}

export const changeAssignedUsers = (assignedUsers) => {
    return {
        type: ASSIGNED_USERS,
        assigned_users: assignedUsers
    }
}

export const changeWrappedTaskId = (wrappedTaskId) => {
    return {
        type: WRAPPED_TASK_ID,
        wrapped_task_id: wrappedTaskId
    }
}
