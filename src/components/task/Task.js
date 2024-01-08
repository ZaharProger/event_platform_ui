import React, { useState } from "react"
import { useTheme, Container } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"

import useTextFieldStyles from "../../hooks/useTextFieldStyles"
import TaskUsersSide from "./TaskUsersSide"
import TaskInfo from "./TaskInfo"
import {
    changeAssignationFlag, changeAssignationList,
    changeNestedTask, changeUsersSideTasksIds
} from '../../redux/actions'
import useSync from "../../hooks/useSync"

export default function Task(props) {
    const { task, user, event_tasks, nested_task,
        event_users, delete_callback, nested_callback } = props

    const dispatch = useDispatch()
    const syncFunction = useSync()

    const usersSideTasksIds = useSelector(state => state.users_side_tasks_ids)
    const isTaskUsersSide = usersSideTasksIds.includes(task.id)

    const assignation = useSelector(state => state.assignation_list)
    const assignationFlag = useSelector(state => state.assignation_flag)

    const theme = useTheme()
    const textFieldStyles = useTextFieldStyles('outlined')

    let taskStates = localStorage.getItem('task_states') !== null ?
        JSON.parse(localStorage.getItem('task_states'))
        :
        [{ label: '', value: '' }]

    const taskState = task !== null ?
        taskStates.filter(type => type.value == task.state)[0].value
        :
        taskStates[0].value

    const colors = [
        'info',
        'action',
        'success',
        'error'
    ]
    taskStates = taskStates.map((item, i) => {
        return {
            ...item,
            color: colors[i]
        }
    })

    const [taskColor, setTaskColor] = useState(task === null ? taskStates[0].color :
        taskStates.filter(stateItem => task.state == stateItem.value)[0].color)

    const taskToolStyles = {
        backgroundColor: theme.palette.info.main,
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: '10px',
        padding: '5px',
        ':hover': {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.action.main
        }
    }

    return (
        <Container className="Task" id={task.id}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: `${theme.palette[taskColor].main}50`,
                borderColor: `${theme.palette.secondary.main}`,
                border: '2px solid',
                borderRadius: '10px',
                padding: '20px 30px',
                width: 'auto!important',
                margin: '0',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'visible',
                transition: '0.8s ease-out',
                transform: isTaskUsersSide ? 'rotateY(360deg)' : 'none'
            }}>
            <TaskUsersSide is_visible={isTaskUsersSide} task={task}
                users={event_users} tasks={event_tasks}
                user={user}
                nested_task={nested_task}
                assignation={assignation}
                text_field_styles={textFieldStyles}
                task_tool_styles={taskToolStyles}
                close_callback={() => {
                    dispatch(
                        changeUsersSideTasksIds(usersSideTasksIds.filter(taskId => {
                            return taskId != task.id
                        }))
                    )
                }} />
            <TaskInfo is_visible={!isTaskUsersSide}
                tasks={event_tasks}
                nested_task={nested_task}
                task={task} user={user}
                assignation={assignation}
                task_tool_styles={taskToolStyles}
                text_field_styles={textFieldStyles}
                task_states={taskStates}
                task_state={taskState}
                task_color_callback={(newValue) => setTaskColor(newValue)}
                nested_callback={(taskName) => {
                    nested_callback((isRoadmap, actualData, currentData) => {
                        return syncFunction(isRoadmap, actualData, currentData)
                    })
                    dispatch(changeNestedTask({
                        id: task.id,
                        name: taskName
                    }))
                }}
                users_side_callback={() => {
                    if (!assignationFlag) {
                        dispatch(changeAssignationList(event_tasks.map(eventTask => {
                            return {
                                id: eventTask.id,
                                users: [...eventTask.users]
                            }
                        })))
                        dispatch(changeAssignationFlag(true))
                    }
                    dispatch(changeUsersSideTasksIds([...usersSideTasksIds, task.id]))
                }}
                delete_callback={() => delete_callback((isRoadmap, actualData, currentData) => {
                    return syncFunction(isRoadmap, actualData, currentData)
                })} />
        </Container>
    )
}
