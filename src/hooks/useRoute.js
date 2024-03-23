import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
    changeAssignationFlag, changeAssignationList, changeData,
    changeFilterStates, changeFilterUsers,
    changeNestedTask, changeUsersSideTasksIds
} from "../redux/actions"

export default function useRoute() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return function (route) {
        if (route === null || route === undefined) {
            window.location.reload()
        }
        else {
            navigate(route)
        }
        dispatch(changeFilterUsers(Array()))
        dispatch(changeData(Array()))
        dispatch(changeFilterStates(Array()))
        dispatch(changeAssignationList(Array()))
        dispatch(changeUsersSideTasksIds(Array()))
        dispatch(changeAssignationFlag(false))
        dispatch(changeNestedTask(null))
    }
}