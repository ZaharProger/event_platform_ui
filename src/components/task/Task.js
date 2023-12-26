import React, { useCallback, useState } from "react"
import { Stack, useTheme, TextField, Typography } from "@mui/material"

import { v4 as uuidV4 } from "uuid"
import useButton from "../../hooks/useButton"
import useColors from "../../hooks/useColors"
import { deleteTool, addNestedTool, assignTool, viewTool } from "../toolbar/tools"
import UserIcon from "./UserIcon"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { prepareDatetime } from '../../utils'

export default function Task(props) {
    const { task, user, event_tasks, event_users, delete_callback } = props

    const theme = useTheme()

    const getTool = useButton(true)
    const getColors = useColors()

    const selectLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Состояние задачи
    </Typography>

    const datetimeStartLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата начала
    </Typography>

    const datetimeEndLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата окончания
    </Typography>

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

    const getTaskUserIcons = useCallback(() => {
        let userIcons = null

        if (task !== null) {
            if (task.users !== undefined) {
                userIcons = <Stack direction="row" spacing={1}
                    justifyContent="center" alignItems="center">
                    {
                        [...task.users]
                            .sort((first, second) => {
                                return second.is_responsible - first.is_responsible
                            })
                            .map((taskUser, i) => {
                                return i < 3 ?
                                    <UserIcon key={`task_user_${uuidV4()}`}
                                        is_responsible={taskUser.is_responsible}
                                        username={taskUser.user.name} />
                                    :
                                    i == 3 ?
                                        <AddCircleIcon color="secondary" />
                                        :
                                        null
                            })
                    }
                </Stack>
            }
        }

        return userIcons
    }, [task])

    return (
        <Stack className="Task" id={task.id}
            direction="column" spacing={3}
            justifyContent="center" alignItems="center"
            marginBottom="30px!important" border="2px solid"
            borderRadius="10px" padding="20px 30px"
            bgcolor={`${theme.palette[taskColor].main}50`}
            borderColor={`${buttonColors.backgroundColor}`}>
            {
                user.is_staff ?
                    <Stack direction="row" spacing={0} marginRight="auto!important"
                        justifyContent="flex-start" alignItems="center">
                        {
                            getTool(deleteTool, () => delete_callback())
                        }
                    </Stack>
                    :
                    null
            }
            <Stack direction="column" spacing={2}
                justifyContent="flex-start" alignItems="center">
                <TextField id="name" defaultValue={task !== null ? task.name : ''}
                    disabled={!user.is_staff}
                    fullWidth label="Название задачи" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                    <TextField id="datetime_start"
                        defaultValue={task !== null ?
                            prepareDatetime(task.datetime_start, true) : ''
                        }
                        disabled={!user.is_staff}
                        type="datetime-local"
                        helperText={datetimeStartLabel} variant="outlined"
                        color="secondary" sx={{ ...textFieldStyles }} />
                    <TextField id="datetime_end"
                        defaultValue={task !== null ?
                            prepareDatetime(task.datetime_end, true) : ''
                        }
                        disabled={!user.is_staff}
                        type="datetime-local"
                        helperText={datetimeEndLabel} variant="outlined"
                        color="secondary" sx={{ ...textFieldStyles }} />
                </Stack>
                <TextField
                    id="state"
                    select
                    onChange={(event) => setTaskColor(taskStates.filter(item => {
                        return item.value == event.target.value
                    })[0].color)}
                    disabled={!user.is_staff}
                    label={selectLabel}
                    sx={{
                        ...textFieldStyles,
                        display: 'flex',
                        marginRight: 'auto!important'
                    }}
                    defaultValue={taskState}
                    SelectProps={{
                        native: true,
                    }}>
                    {
                        taskStates.map((stateFromSelect) => {
                            const { label, value } = stateFromSelect
                            return <option key={label} value={value}>
                                {
                                    value
                                }
                            </option>
                        })
                    }
                </TextField>
            </Stack>
            <Stack direction="column" spacing={1} width="100%"
                justifyContent="center" alignItems="center">
                <Stack spacing={2} direction="row" 
                    justifyContent="center" marginRight="auto!important"
                    alignItems="center" useFlexGap flexWrap="wrap">
                    <Stack direction="column" spacing={1}
                        justifyContent="center" alignItems="center">
                        {
                            getTaskUserIcons()
                        }
                        {
                            task !== null ?
                                <Typography color="secondary"
                                    variant="caption" textAlign="center">
                                    {
                                        `Всего исполнителей: ${task.users.length}`
                                    }
                                </Typography>
                                :
                                null
                        }
                    </Stack>
                    {
                        getTool(
                            user.is_staff ? assignTool : viewTool,
                            () => console.log(1)
                        )
                    }
                </Stack>
                <Stack direction="row" spacing={2} marginRight="auto!important"
                    justifyContent="center" alignItems="center" 
                    useFlexGap flexWrap="wrap">
                    {
                        task !== null ?
                            <Typography color="secondary" variant="caption"
                                textAlign="center">
                                {
                                    `Всего подзадач: ${task.nested_tasks.length}`
                                }
                            </Typography>
                            :
                            null
                    }
                    {
                        user.is_staff ?
                            getTool(addNestedTool, () => console.log(1))
                            :
                            null
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}
