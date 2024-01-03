import React, { useCallback } from 'react'
import {
    Stack, Typography, FormControlLabel,
    Checkbox, useTheme, useMediaQuery, Tooltip
} from '@mui/material'

import useButton from '../../hooks/useButton'
import { assignTool, unpinTool } from '../toolbar/tools'
import { useDispatch } from 'react-redux'
import { changeAssignationList } from '../../redux/actions'

export default function TaskUser(props) {
    const { user: { id, name, email } } = props.user

    const dispatch = useDispatch()

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

    const updateResponsibility = useCallback(() => {
        dispatch(
            changeAssignationList(props.assignation.map(item => {
                const isChangedTask = item.id == props.related_task_id
                return {
                    id: item.id,
                    users: item.users.map(itemUser => {
                        const isChangedUser = itemUser.user.id == id
                        return {
                            ...itemUser,
                            is_responsible: isChangedUser && isChangedTask ?
                                !itemUser.is_responsible
                                :
                                itemUser.is_responsible
                        }
                    }),
                }
            }))
        )
    }, [props.assignation, props.related_task_id, id])

    const changeAssignation = useCallback(() => {
        dispatch(
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
    }, [props.has_responsible, props.assignation, id,
        props.user, props.related_task_id, props.is_assigned])

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
                            onChange={() => updateResponsibility()}
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
                        () => changeAssignation()
                    )
                }
            </Stack>
        </Stack>
    )
}