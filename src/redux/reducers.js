import { defaultState } from "./initialState"

export function defaultReducer(action, state=defaultState) {
    switch(action.type) {
        default:
            return state
    }
}