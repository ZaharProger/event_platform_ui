import {
    Stack, TextField, Typography, useTheme,
    Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import { v4 as uuidV4 } from "uuid"
import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import { applyButton, assignButton, closeButton, viewButton } from '../buttons'
import { prepareDatetime } from '../../utils'
import UserIcon from './UserIcon'
import { deleteTool } from '../toolbar/tools'
import EventUsersList from '../event/EventUsersList'
import { useDispatch } from 'react-redux'
import { changeAssignedUsers } from '../../redux/actions'

export default function Task(props) {
    const { task, user, event_users, assigned_users,
        delete_callback, sync_callback } = props

    const theme = useTheme()

    const getButton = useButton(false)
    const getTool = useButton(true)

    const [taskAssignedUsers, setTaskAssignedUsers] = useState(() => {
        let initValue = []
        if (task !== null) {
            initValue = task.users === undefined ? [] : task.users.map(taskUser => taskUser.user.id)
        }

        return initValue
    })
    const assignButtonHandler = useCallback((userId, isAssigned) => {
        if (isAssigned) {
            setTaskAssignedUsers([...taskAssignedUsers].filter(assignedUser => assignedUser != userId))
        }
        else {
            setTaskAssignedUsers([...taskAssignedUsers, userId])
        }
    }, [taskAssignedUsers])

    const dispatch = useDispatch()

    const [isUsersModalOpened, setIsUsersModalOpened] = useState(false)
    const dialogButtons = [
        getButton(closeButton, () => {
            setTaskAssignedUsers(task === null ? [] : task.users.map(taskUser => taskUser.user.id))
            setIsUsersModalOpened(false)
        }),
    ]
    if (user.is_staff) {
        dialogButtons.push(
            getButton(applyButton, () => {
                if (task !== null) {
                    let newAssignedUsers = []
                    if (assigned_users.length == 0) {
                        newAssignedUsers.push({
                            task: task.id,
                            users: [...taskAssignedUsers]
                        })
                    }
                    else {
                        const isAssignationExists = assigned_users.filter(assignation => {
                            return assignation.task == task.id
                        }).length != 0
                        if (isAssignationExists) {
                            newAssignedUsers = assigned_users.map(assignation => {
                                const newAssignation = {
                                    task: assignation.task,
                                    users: assignation.task == task.id ?
                                        [...taskAssignedUsers]
                                        :
                                        [...assignation.users]
                                }

                                return newAssignation
                            })
                        }
                        else {
                            newAssignedUsers = assigned_users.map(assignation => {
                                return {
                                    task: assignation.task,
                                    users: [...assignation.users]
                                }
                            })
                            newAssignedUsers.push({
                                task: task.id,
                                users: [...taskAssignedUsers]
                            })
                        }
                    }

                    dispatch(changeAssignedUsers(newAssignedUsers))
                    sync_callback()
                }
            })
        )
    }

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
            }
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

    const isOrganizer = event_users
        .filter(eventUser => eventUser.is_organizer && eventUser.user.id == user.user.id)
        .length != 0

    return (
        <Stack direction="row" spacing={1} className="Task" id={task.id}>
            {
                isOrganizer ? getTool(deleteTool, () => delete_callback(task.id)) : null
            }
            <Stack direction="column" spacing={4}
                justifyContent="center" alignItems="center"
                marginBottom="30px!important" border="2px solid" borderRadius="10px"
                bgcolor={`${theme.palette[taskColor].main}50`}
                borderColor={`${buttonColors.backgroundColor}`} padding="20px 30px">
                <Stack direction="column" spacing={2} justifyContent="flex-start" alignItems="center">
                    {
                        isOrganizer ?
                            <TextField id="name" defaultValue={task !== null ? task.name : ''}
                                fullWidth label="Название задачи" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            :
                            <Typography color="secondary" variant="subtitle1" fontWeight="bold">
                                {
                                    task !== null ? task.name : ''
                                }
                            </Typography>
                    }
                    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                        {
                            isOrganizer ?
                                <>
                                    <TextField id="datetime_start"
                                        defaultValue={task !== null ?
                                            prepareDatetime(task.datetime_start, true) : ''}
                                        type="datetime-local"
                                        helperText={datetimeStartLabel} variant="outlined"
                                        color="secondary" sx={{ ...textFieldStyles }} />
                                    <TextField id="datetime_end"
                                        defaultValue={task !== null ?
                                            prepareDatetime(task.datetime_end, true) : ''}
                                        type="datetime-local"
                                        helperText={datetimeStartLabel} variant="outlined"
                                        color="secondary" sx={{ ...textFieldStyles }} />
                                </>
                                :
                                task !== null ?
                                    task.datetime_end === null?
                                        <Typography color="secondary" variant="subtitle1" fontSize="0.9em">
                                            {
                                                `Начало задачи ${prepareDatetime(task.datetime_start)}`
                                            }
                                        </Typography>
                                        :
                                        <Typography color="secondary" variant="subtitle1" fontSize="0.9em">
                                            {
                                                `Начало задачи ${prepareDatetime(task.datetime_start)}`                                               
                                            }
                                            <br />
                                            {
                                                `Крайний срок ${prepareDatetime(task.datetime_end)}`
                                            }
                                        </Typography>
                                :
                                null
                        }
                    </Stack>
                </Stack>
                <Stack spacing={4} direction="row" justifyContent="center"
                    alignItems="center" useFlexGap flexWrap="wrap">
                    <Stack spacing={1} direction="row" justifyContent="center" alignItems="center"
                        useFlexGap flexWrap="wrap">
                        {
                            task !== null ?
                                task.users !== undefined ?
                                    task.users.map((taskUser, i) => {
                                        return i < 3 ?
                                            <UserIcon key={`task_user_${uuidV4()}`}
                                                username={taskUser.user.name} />
                                            :
                                            null
                                    })
                                    :
                                    null
                                :
                                null
                        }
                        {
                            getButton(
                                isOrganizer ? assignButton : viewButton,
                                () => setIsUsersModalOpened(true)
                            )
                        }
                    </Stack>
                    {
                        isOrganizer ?
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
                            :
                            <Typography color="secondary" variant="subtitle1" fontSize="0.9em">
                                {
                                    taskState
                                }
                            </Typography>
                    }
                </Stack>
            </Stack>
            <Dialog open={isUsersModalOpened} onClose={() => setIsUsersModalOpened(false)} fullScreen>
                <DialogTitle color="primary"
                    sx={{ backgroundColor: theme.palette.secondary.main }}>
                    Назначение исполнителей
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: theme.palette.info.main }}>
                    <EventUsersList user={user} users={event_users}
                        task={task}
                        is_organizer={isOrganizer}
                        assigned_users={taskAssignedUsers}
                        assign_callback={(userId, isAssigned) =>
                            assignButtonHandler(userId, isAssigned)} />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: theme.palette.info.main }}>
                    {
                        dialogButtons
                    }
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
