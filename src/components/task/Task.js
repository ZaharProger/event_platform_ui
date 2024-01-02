import React, { useState } from "react"
import { useTheme, Container } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"

import useTextFieldStyles from "../../hooks/useTextFieldStyles"
import TaskUsersSide from "./TaskUsersSide"
import TaskInfo from "./TaskInfo"
import { changeUsersSideTasksIds } from '../../redux/actions'

export default function Task(props) {
    const { task, user, event_tasks, event_users,
        sync_callback, delete_callback, update_callback } = props

    const dispatch = useDispatch()
    const usersSideTasksIds = useSelector(state => state.users_side_tasks_ids)
    const isTaskUsersSide = usersSideTasksIds.includes(task.id)

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
            }}>
            <TaskUsersSide is_visible={isTaskUsersSide} task={task}
                users={event_users} tasks={event_tasks}
                text_field_styles={textFieldStyles}
                task_tool_styles={taskToolStyles}
                update_callback={(newData) => {
                    sync_callback()
                    update_callback(newData)
                }}
                close_callback={() => dispatch(
                    changeUsersSideTasksIds(usersSideTasksIds.filter(taskId => {
                        return taskId != task.id
                    })))} />
            <TaskInfo is_visible={!isTaskUsersSide}
                task={task} user={user}
                task_tool_styles={taskToolStyles}
                text_field_styles={textFieldStyles}
                task_states={taskStates}
                task_state={taskState}
                task_color_callback={(newValue) => setTaskColor(newValue)}
                users_side_callback={() => {
                    sync_callback()
                    dispatch(changeUsersSideTasksIds([...usersSideTasksIds, task.id]))
                }}
                delete_callback={() => delete_callback()} />
        </Container>
    )
}
