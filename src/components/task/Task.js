import { Box, Stack, TextField, Typography } from '@mui/material'
import React from 'react'

import { v4 as uuidV4 } from "uuid"
import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import { assignButton } from '../buttons'
import { prepareDatetime } from '../../utils'

export default function Task(props) {
    const {task} = props

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
        assignButton
    )

    const taskStates = localStorage.getItem('task_states') !== null? 
        JSON.parse(localStorage.getItem('task_states')) 
        : 
        [{label: '', value: ''}]
    const taskState = task !== null ? 
        taskStates.filter(type => type.value == task.state)[0].value
        :
        taskStates[0].value

    return (
        <Stack direction="column" spacing={4} justifyContent="center" alignItems="center"
            marginBottom="30px!important" border="2px solid" borderRadius="10px"
            borderColor={`${buttonColors.backgroundColor}`} padding="20px 30px">
            <Stack direction="column" spacing={2} justifyContent="flex-start" alignItems="center">
                <TextField id="name" required autoFocus
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
                            const splittedName = taskUser.user.name.split(' ')
                            return <Box key={`task_user_${uuidV4()}`} borderRadius="100%"
                                bgcolor={buttonColors.backgroundColor} padding="10px">
                                <Typography color="primary" fontSize="0.7em" textAlign="center">
                                {
                                    splittedName.length == 1?
                                        splittedName[0].substring(0, 1).toUpperCase()
                                        :
                                        [splittedName[0], splittedName[1]]
                                            .map(namePart => namePart.substring(0, 1).toUpperCase())
                                            .join('')
                                }
                                </Typography>
                            </Box>
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
