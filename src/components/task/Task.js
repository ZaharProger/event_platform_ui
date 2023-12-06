import { Stack, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'

import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import { assignButton, viewButton } from '../buttons'
import { prepareDatetime } from '../../utils'
import UserIcon from './UserIcon'

export default function Task(props) {
    const {task, user} = props
    
    const theme = useTheme()

    const getButton = useButton(false)

    const getColors = useColors()
    const buttonColors = getColors(assignButton)

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: buttonColors.color,
            '& fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&:hover fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&.Mui-focused fieldset': {
                borderColor: buttonColors[':hover'].backgroundColor,
            },
        }
    }

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

    const button = getButton(
        user.is_staff? assignButton : viewButton
    )

    let taskStates = localStorage.getItem('task_states') !== null? 
        JSON.parse(localStorage.getItem('task_states')) 
        : 
        [{label: '', value: ''}]
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

    const [taskColor, setTaskColor] = useState(() => {
        let initColor

        if (task !== null) {
            initColor = taskStates.filter(item => task.state == item.value)[0].color
        }
        else {
            initColor = taskStates[0].color
        }

        return initColor
    })

    return (
        <Stack direction="column" spacing={4} justifyContent="center" alignItems="center"
            marginBottom="30px!important" border="2px solid" borderRadius="10px"
            bgcolor={`${theme.palette[taskColor].main}50`}
            borderColor={`${buttonColors.backgroundColor}`} padding="20px 30px">
            <Stack direction="column" spacing={2} justifyContent="flex-start" alignItems="center">
                <TextField id="name" required
                    defaultValue={task !== null ? task.name : ''}
                    fullWidth label="Название задачи" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                    <TextField id="datetime_start" required
                        defaultValue={task !== null ?
                            prepareDatetime(task.datetime_start, true) : ''}
                        type="datetime-local"
                        helperText={datetimeStartLabel} variant="outlined"
                        color="secondary" sx={{ ...textFieldStyles }} />
                    <TextField id="datetime_end"
                        defaultValue={task !== null ?
                            task.datetime_end !== null ?
                                prepareDatetime(task.datetime_end, true) : '' : ''}
                        type="datetime-local"
                        helperText={datetimeEndLabel} variant="outlined"
                        color="secondary" sx={{ ...textFieldStyles }} />
                </Stack>
            </Stack>
            <Stack spacing={4} direction="row" justifyContent="center"
                alignItems="center" useFlexGap flexWrap="wrap">
                <Stack spacing={1} direction="row" justifyContent="center" alignItems="center"
                    useFlexGap flexWrap="wrap">
                {
                    task !== null?
                        task.users.map(taskUser => {
                            return <UserIcon username={taskUser.user.name} />
                        })
                        :
                        null
                }
                {
                    button
                }
                </Stack>
                <TextField
                    id="state"
                    select
                    onChange={(event) => setTaskColor(taskStates.filter(item => {
                        return item.value == event.target.value
                    })[0].color)}
                    label={selectLabel}
                    sx={{ ...textFieldStyles }}
                    defaultValue={taskState}
                    SelectProps={{
                        native: true,
                    }}>
                    {taskStates.map((stateFromSelect) => (
                        <option key={stateFromSelect.label} value={stateFromSelect.value}>
                            {stateFromSelect.value}
                        </option>
                    ))}
                </TextField>
            </Stack>
        </Stack>
    )
}
