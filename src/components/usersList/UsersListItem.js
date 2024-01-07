import React, { useCallback } from 'react'
import {
    Stack, Typography, FormControlLabel,
    Checkbox, useTheme, useMediaQuery, Tooltip
} from '@mui/material'

import useButton from '../../hooks/useButton'
import { assignTool, excludeTool, includeTool, unpinTool } from '../toolbar/tools'
import { useDispatch, useSelector } from 'react-redux'
import { changeAssignationList, changeFilterUsers } from '../../redux/actions'

export default function UsersListItem(props) {
    const { user: { id, name, email } } = props.user

    const dispatch = useDispatch()
    const filterUsers = useSelector(state => state.filter_users)

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const theme = useTheme()

    const getTool = useButton(true)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначить ответственным
    </Typography>

    const getTaskStat = useCallback((as_str = false) => {
        const relatedTasksAmount = props.assignation
            .filter(item => {
                return item.users
                    .filter(itemUser => itemUser.user.id == id)
                    .length != 0
            })
            .length

        return as_str ?
            [
                `${relatedTasksAmount}/${props.assignation.length}`,
                `Задействован в ${relatedTasksAmount} из ${props.assignation.length} задач`
            ]
            :
            [relatedTasksAmount, props.event_tasks.length]
    }, [props, id])

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
    }, [props, theme, getTaskStat])

    let taskStat = null
    if (props.for_task) {
        taskStat = getTaskStat(true)
    }

    const getButtons = useCallback(() => {
        return props.for_task ?
            getTool(
                props.is_assigned ? unpinTool : assignTool,
                () => dispatch(
                    changeAssignationList(props.assignation.map(item => {
                        const isChangedTask = item.id == props.related_task_id
                        let newUsers = []

                        if (props.is_assigned) {
                            newUsers = item.users
                                .filter(itemUser => {
                                    const isChangedUser = itemUser.user.id == id
                                    return !(isChangedUser && isChangedTask)
                                })
                        }
                        else {
                            newUsers = item.users
                                .map(itemUser => {
                                    return {
                                        ...itemUser
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
                            id: item.id,
                            users: newUsers
                        }
                    }))
                )
            )
            :
            props.is_editable ?
                getTool(
                    filterUsers.includes(id) ? excludeTool : includeTool,
                    () => dispatch(
                        changeFilterUsers(
                            filterUsers.includes(id) ?
                                filterUsers.filter(filterUser => filterUser != id)
                                :
                                [...filterUsers, id]
                        )
                    )
                )
                :
                null
    }, [props, id, filterUsers, dispatch, getTool])

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
                    props.for_task && props.is_editable ?
                        props.is_assigned && (!props.has_responsible || props.is_responsible) ?
                            <FormControlLabel sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: 'auto!important'
                            }} control={<Checkbox id={`is_responsible_${id}`}
                                onChange={() => dispatch(
                                    changeAssignationList(props.assignation.map(item => {
                                        const isChangedTask = item.id == props.related_task_id
                                        return {
                                            id: item.id,
                                            users: item.users.map(itemUser => {
                                                const isChangedUser = itemUser.user.id == id
                                                const toChange = isChangedUser && isChangedTask

                                                return {
                                                    ...itemUser,
                                                    is_responsible: toChange ?
                                                        !itemUser.is_responsible
                                                        :
                                                        itemUser.is_responsible
                                                }
                                            }),
                                        }
                                    }))
                                )}
                                checked={props.is_responsible}
                                sx={{
                                    color: theme.palette.secondary.main,
                                    "&.Mui-checked": {
                                        color: theme.palette.action.main,
                                    }
                                }} />}
                                label={checkboxLabel} />
                            :
                            null
                        :
                        null
                }
                {
                    props.for_task ?
                        <Tooltip title={taskStat[1]}>
                            <Typography variant="caption" marginRight="auto!important"
                                fontWeight="bold" color="primary" padding="5px 10px"
                                bgcolor={getBusyColor()}
                                borderRadius="10px">
                                {
                                    taskStat[0]
                                }
                            </Typography>
                        </Tooltip>
                        :
                        null
                }
            </Stack>
            {
                props.for_task || props.is_editable ?
                    <Stack direction="column" spacing={1}
                        justifyContent="center" alignItems="center">
                        {
                            getButtons()
                        }
                    </Stack>
                    :
                    null
            }
        </Stack>
    )
}
