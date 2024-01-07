import {DATA, TRIGGER, SELECTED_CARD_TAB, 
    SHOW_COMPLETED_EVENTS, USER, USERS_SIDE_TASKS_IDS, ASSIGNATION_LIST, 
    ASSIGNATION_FLAG, FILTER_USERS, FILTER_STATES, NESTED_TASK} from './constants'

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

export const changeUsersSideTasksIds = (usersSideTasksIds) => {
    return {
        type: USERS_SIDE_TASKS_IDS,
        users_side_tasks_ids: usersSideTasksIds
    }
}

export const changeAssignationList = (assignationList) => {
    return {
        type: ASSIGNATION_LIST,
        assignation_list: assignationList
    }
}

export const changeAssignationFlag = (assignationFlag) => {
    return {
        type: ASSIGNATION_FLAG,
        assignation_flag: assignationFlag
    }
}

export const changeFilterUsers = (filterUsers) => {
    return {
        type: FILTER_USERS,
        filter_users: filterUsers
    }
}

export const changeFilterStates = (filterStates) => {
    return {
        type: FILTER_STATES,
        filter_states: filterStates
    }
}

export const changeNestedTask = (nestedTask) => {
    return {
        type: NESTED_TASK,
        nested_task: nestedTask
    }
}
