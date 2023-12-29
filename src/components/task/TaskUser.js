import React, { useCallback } from 'react'
import {
    Stack, Typography, FormControlLabel,
    Checkbox, useTheme, useMediaQuery, Tooltip
} from '@mui/material'

import useColors from '../../hooks/useColors'
import { saveButton } from '../buttons'
import useButton from '../../hooks/useButton'
import { assignTool, unpinTool } from '../toolbar/tools'

export default function TaskUser(props) {
    const { user: { id, name, email } } = props.user

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const theme = useTheme()

    const getTool = useButton(true)

    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначить ответственным
    </Typography>

    const getTaskStat = useCallback((as_str = false) => {
        const relatedTasksAmount = props.event_tasks
            .filter(eventTask => {
                return eventTask.users.filter(taskUser => taskUser.user.id == id).length != 0
            })
            .length

        return as_str ?
            [
                `${relatedTasksAmount}/${props.event_tasks.length}`,
                `Задействован в ${relatedTasksAmount} из ${props.event_tasks.length} задач`
            ]
            :
            [relatedTasksAmount, props.event_tasks.length]
    }, [props])

    const getBusyColor = useCallback(() => {
        const [relatedTasksAmount, allTasksAmount] = getTaskStat()
        const taskStat = relatedTasksAmount / allTasksAmount

        return taskStat < 0.5 ?
            theme.palette.success.main
            :
            taskStat < 0.7 ?
                theme.palette.action.main
                :
                theme.palette.error.main
    }, [props])

    const [caption, tooltipTitle] = getTaskStat(true)

    return (
        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 6}
            bgcolor={`${theme.palette.primary.main}`}
            padding="10px"
            width="100%"
            borderRadius="10px"
            border={`2px solid ${theme.palette.secondary.main}`}
            justifyContent={isMobile ? 'center' : 'space-between'} alignItems="center">
            <Stack spacing={0} justifyContent="flex-start"
                alignItems="center" width="100%">
                <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                    display="block" fontWeight="bold" fontSize="0.9em">
                    {name}
                </Typography>
                <Typography variant="caption" marginRight="auto!important"
                    color="secondary" display="block">
                    {email}
                </Typography>
                {
                    props.is_assigned && (!props.has_responsible || props.is_responsible) ?
                        <FormControlLabel sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 'auto!important'
                        }} control={<Checkbox id={`is_responsible_${id}`}
                            onChange={() => {
                                props.update_callback(props.event_tasks.map(eventTask => {
                                    const isChangedTask = eventTask.id == props.related_task_id
                                    return {
                                        ...eventTask,
                                        users: eventTask.users.map(eventUser => {
                                            const isChangedUser = eventUser.user.id == id
                                            return {
                                                ...eventUser,
                                                is_responsible: isChangedUser && isChangedTask?
                                                    !eventUser.is_responsible
                                                    :
                                                    eventUser.is_responsible
                                            }
                                        }),
                                        nested_tasks: [...eventTask.nested_tasks],
                                    }
                                }))
                            }}
                            checked={props.is_responsible}
                            sx={{
                                color: buttonColors.backgroundColor,
                                "&.Mui-checked": {
                                    color: buttonColors[':hover'].backgroundColor,
                                }
                            }} />}
                            label={checkboxLabel} />
                        :
                        null
                }
                <Tooltip title={tooltipTitle}>
                    <Typography variant="caption" marginRight="auto!important"
                        fontWeight="bold" color="primary" padding="5px 10px"
                        bgcolor={getBusyColor()}
                        borderRadius="10px">
                        {
                            caption
                        }
                    </Typography>
                </Tooltip>
            </Stack>
            <Stack direction="column" spacing={1}
                justifyContent="center" alignItems="center" >
                {
                    getTool(
                        props.is_assigned ? unpinTool : assignTool,
                        () => props.update_callback(props.event_tasks.map(eventTask => {
                            const isChangedTask = eventTask.id == props.related_task_id
                            let newUsers = []

                            if (props.is_assigned) {
                                newUsers = eventTask.users
                                    .filter(eventUser => {
                                        const isChangedUser = eventUser.user.id == id
                                        return !(isChangedUser && isChangedTask)
                                    })
                            }
                            else {
                                newUsers = eventTask.users
                                    .map(eventUser => {
                                        return {
                                            ...eventUser
                                        }
                                    })
                                if (isChangedTask) {
                                    newUsers.push({
                                        user: {
                                            ...props.user.user
                                        },
                                        is_responsible: !props.has_responsible
                                    })
                                }
                            }

                            return {
                                ...eventTask,
                                users: newUsers,
                                nested_tasks: [...eventTask.nested_tasks]
                            }
                        }))
                    )
                }
            </Stack>
        </Stack>
    )
}