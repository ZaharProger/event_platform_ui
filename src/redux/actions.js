import {DATA, USER} from './constants'

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