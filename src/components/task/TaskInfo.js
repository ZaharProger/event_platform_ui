import { useTheme, Stack, TextField, Typography } from '@mui/material'
import React, { useCallback } from 'react'

import { v4 as uuidV4 } from "uuid"
import { prepareDatetime } from '../../utils'
import UserIcon from './UserIcon'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { addNestedTool, assignTool, deleteTool, viewTool } from '../toolbar/tools'
import useButton from '../../hooks/useButton'

export default function TaskInfo(props) {
    const { is_visible, task, user, delete_callback,
        task_state, task_states, task_tool_styles,
        text_field_styles, task_color_callback, users_side_callback } = props

    const theme = useTheme()

    const getTool = useButton(true)

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
                                        username={taskUser.user.name}
                                        font_size={'0.5em'} />
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
        <Stack direction="column" spacing={3} display={is_visible ? 'flex' : 'none'}
            justifyContent="center" alignItems="center">
            {
                user.is_staff ?
                    <Stack direction="row" spacing={0} marginRight="auto!important"
                        justifyContent="flex-start" alignItems="center">
                        {
                            getTool(
                                deleteTool,
                                () => delete_callback(),
                                {
                                    ...task_tool_styles,
                                    ':hover': {
                                        backgroundColor: theme.palette.info.main
                                    }
                                }
                            )
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
                    color="secondary" sx={{ ...text_field_styles }} />
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                    <TextField id="datetime_start"
                        defaultValue={task !== null ?
                            prepareDatetime(task.datetime_start, true) : ''
                        }
                        disabled={!user.is_staff}
                        type="datetime-local"
                        helperText={datetimeStartLabel} variant="outlined"
                        color="secondary" sx={{ ...text_field_styles }} />
                    <TextField id="datetime_end"
                        defaultValue={task !== null ?
                            prepareDatetime(task.datetime_end, true) : ''
                        }
                        disabled={!user.is_staff}
                        type="datetime-local"
                        helperText={datetimeEndLabel} variant="outlined"
                        color="secondary" sx={{ ...text_field_styles }} />
                </Stack>
                <TextField
                    id="state"
                    select
                    onChange={(event) => task_color_callback(task_states.filter(item => {
                        return item.value == event.target.value
                    })[0].color)}
                    disabled={!user.is_staff}
                    label={selectLabel}
                    sx={{
                        ...text_field_styles,
                        display: 'flex',
                        marginRight: 'auto!important'
                    }}
                    defaultValue={task_state}
                    SelectProps={{
                        native: true,
                    }}>
                    {
                        task_states.map((stateFromSelect) => {
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
                            () => users_side_callback(),
                            task_tool_styles
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
                            getTool(
                                addNestedTool,
                                () => console.log(1),
                                task_tool_styles
                            )
                            :
                            null
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}
