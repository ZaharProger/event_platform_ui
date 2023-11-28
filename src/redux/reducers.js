import { defaultState } from "./initialState"

export function defaultReducer(state=defaultState, action) {
    switch(action.type) {
        default:
            return state
    }
}