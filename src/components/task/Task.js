import React, { useState } from "react"
import { useTheme, Container } from "@mui/material"

import useColors from "../../hooks/useColors"
import { assignTool } from "../toolbar/tools"
import TaskUsersSide from "./TaskUsersSide"
import TaskInfo from "./TaskInfo"

export default function Task(props) {
    const { task, user, event_tasks, event_users, delete_callback } = props

    const theme = useTheme()

    const [isTaskUsersSide, setIsTaskUsersSide] = useState(false)

    const getColors = useColors()

    const buttonColors = getColors(assignTool, false)
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: user.is_staff ? buttonColors.color : 'transparent',
            '& fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&:hover fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&.Mui-focused fieldset': {
                borderColor: buttonColors[':hover'].backgroundColor,
            }
        }
    }

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
                borderColor: `${buttonColors.backgroundColor}`,
                border: '2px solid',
                borderRadius: '10px',
                padding: '20px 30px',
                width: 'auto!important',
                margin: '0'
            }}>
            <TaskUsersSide is_visible={isTaskUsersSide} task={task}
                users={event_users} tasks={event_tasks}
                text_field_styles={textFieldStyles}
                task_tool_styles={taskToolStyles}
                close_callback={() => setIsTaskUsersSide(false)} />
            <TaskInfo is_visible={!isTaskUsersSide}
                task={task} user={user}
                task_tool_styles={taskToolStyles}
                text_field_styles={textFieldStyles}
                task_states={taskStates}
                task_state={taskState}
                task_color_callback={(newValue) => setTaskColor(newValue)}
                users_side_callback={() => setIsTaskUsersSide(true)}
                delete_callback={() => delete_callback()} />
        </Container>
    )
}
