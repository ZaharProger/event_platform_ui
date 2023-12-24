import {
    Stack, TextField, Typography, useTheme,
    Dialog, DialogActions, DialogContent, DialogTitle, Container, Zoom
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import { v4 as uuidV4 } from "uuid"
import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import { addNestedButton, applyButton, assignButton, closeButton, viewButton } from '../buttons'
import { prepareDatetime } from '../../utils'
import UserIcon from './UserIcon'
import { deleteTool, unwrapTool, wrapTool } from '../toolbar/tools'
import EventUsersList from '../event/EventUsersList'
import { useDispatch } from 'react-redux'
import { changeAssignedUsers, changeWrappedTaskId } from '../../redux/actions'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function Task(props) {
    const { task, user, assigned_users, wrap_callback,
        delete_callback, sync_callback, users, fields, is_wrapped } = props

    const dispatch = useDispatch()
    
    const theme = useTheme()

    const getButton = useButton(false)
    const getTool = useButton(true)

    const [taskAssignedUsers, setTaskAssignedUsers] = useState(() => {
        let initValue = []
        if (task !== null) {
            initValue = task.users === undefined ? [] : task.users.map(taskUser => {
                return {
                    user_id: taskUser.user.id,
                    is_responsible: taskUser.is_responsible
                }
            })
        }

        return initValue
    })
    const assignButtonHandler = useCallback((userId, isResponsible, unpin) => {
        const newAssignation = taskAssignedUsers.map(user => {
            return {
                ...user
            }
        })

        if (unpin) {
            setTaskAssignedUsers(newAssignation.filter(assignedUser => assignedUser.user_id != userId))
        }
        else {
            let existingUserIndex = 0
            const existingUser = newAssignation.filter((user, i) => {
                const isEqualIds = user.user_id == userId
                if (isEqualIds) {
                    existingUserIndex = i
                }

                return isEqualIds
            })
            if (existingUser.length != 0) {
                newAssignation[existingUserIndex].is_responsible = isResponsible
            }
            else {
                newAssignation.push({
                    user_id: userId,
                    is_responsible: isResponsible
                })
            }

            setTaskAssignedUsers(newAssignation)
        }
    }, [taskAssignedUsers])

    const [isUsersModalOpened, setIsUsersModalOpened] = useState(false)
    const dialogButtons = [
        getButton(closeButton, () => {
            setTaskAssignedUsers(task === null ? [] : task.users.map(taskUser => {
                return {
                    user_id: taskUser.user.id,
                    is_responsible: taskUser.is_responsible
                }
            }))
            setIsUsersModalOpened(false)
        }),
    ]
    if (user.is_staff) {
        dialogButtons.push(
            getButton(applyButton, () => {
                const savedAssignedUsers = taskAssignedUsers.map(user => {
                    return {
                        user_id: user.user_id,
                        is_responsible: user.is_responsible
                    }
                })

                if (task !== null) {
                    let newAssignedUsers = []
                    if (assigned_users.length == 0) {
                        newAssignedUsers.push({
                            task: task.id,
                            users: savedAssignedUsers
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
                                        savedAssignedUsers
                                        :
                                        assignation.users.map(user => {
                                            return {
                                                user_id: user.user_id,
                                                is_responsible: user.is_responsible
                                            }
                                        })
                                }

                                return newAssignation
                            })
                        }
                        else {
                            newAssignedUsers = assigned_users.map(assignation => {
                                return {
                                    task: assignation.task,
                                    users: assignation.users.map(user => {
                                        return {
                                            user_id: user.user_id,
                                            is_responsible: user.is_responsible
                                        }
                                    })
                                }
                            })
                            newAssignedUsers.push({
                                task: task.id,
                                users: savedAssignedUsers
                            })
                        }
                    }

                    dispatch(changeAssignedUsers(newAssignedUsers))
                    sync_callback(newAssignedUsers)
                }
            })
        )
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

    const getColors = useColors()
    const buttonColors = getColors(assignButton)

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

    return (
        <Stack direction="row" spacing={0} className="Task" id={task.id}>
            <Stack direction="column" spacing={2} 
                justifyContent="start" alignItems={is_wrapped ? 'center' : 'start'}>
                {
                    getTool(
                        is_wrapped? unwrapTool : wrapTool,
                        () => {
                            if (is_wrapped) {
                                wrap_callback(false)
                                dispatch(changeWrappedTaskId(task.id))
                            }
                            else {
                                wrap_callback(true)
                                dispatch(changeWrappedTaskId(null))
                            }
                        }
                    )
                }
                {
                    user.is_staff && is_wrapped ? 
                        getTool(deleteTool, () => delete_callback(task.id)) 
                        : 
                        null
                }
            </Stack>
            <Stack direction="column" spacing={4}
                justifyContent="center" alignItems="center"
                marginBottom="30px!important" border="2px solid" borderRadius="10px"
                bgcolor={`${theme.palette[taskColor].main}50`}
                borderColor={`${buttonColors.backgroundColor}`} padding="20px 30px">
                <Stack direction="column" spacing={2} justifyContent="flex-start" alignItems="center">
                    <TextField id="name" defaultValue={task !== null ? task.name : ''}
                        disabled={!user.is_staff}
                        fullWidth label="Название задачи" variant="outlined"
                        color="secondary" sx={{ ...textFieldStyles }} />
                    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                        <TextField id="datetime_start"
                            defaultValue={task !== null ?
                                prepareDatetime(task.datetime_start, true) : ''}
                            disabled={!user.is_staff}
                            type="datetime-local"
                            helperText={datetimeStartLabel} variant="outlined"
                            color="secondary" sx={{ ...textFieldStyles }} />
                        <TextField id="datetime_end"
                            defaultValue={task !== null ?
                                prepareDatetime(task.datetime_end, true) : ''}
                            disabled={!user.is_staff}
                            type="datetime-local"
                            helperText={datetimeEndLabel} variant="outlined"
                            color="secondary" sx={{ ...textFieldStyles }} />
                    </Stack>
                </Stack>
                <Stack spacing={4} direction="row" justifyContent="center"
                    alignItems="center" useFlexGap flexWrap="wrap">
                    <Stack spacing={3} direction="row" justifyContent="center" alignItems="center"
                        useFlexGap flexWrap="wrap">
                        <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
                            {
                                task !== null ?
                                    task.users !== undefined ?
                                        <Stack direction="row" spacing={1} justifyContent="center"
                                            alignItems="center">
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
                                        :
                                        null
                                    :
                                    null
                            }
                            {
                                task !== null ?
                                    <Typography color="secondary" variant="caption">
                                        {
                                            `Всего исполнителей: ${task.users.length}`
                                        }
                                    </Typography>
                                    :
                                    null
                            }
                        </Stack>
                        <Zoom in={!is_wrapped}>
                            {
                                getButton(
                                    user.is_staff ? assignButton : viewButton,
                                    () => setIsUsersModalOpened(true),
                                    null,
                                    {
                                        display: is_wrapped ? 'none' : 'flex'
                                    }
                                )
                            }
                        </Zoom>
                    </Stack>
                    <Zoom in={!is_wrapped}>
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
                                display: is_wrapped ? 'none' : 'flex' 
                            }}
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
                    </Zoom>
                </Stack>
                <Zoom in={!is_wrapped}>
                    <Container sx={{
                        justifyContent: 'flex-end',
                        display: is_wrapped ? 'none' : 'flex'
                    }}>
                        {
                            user.is_staff ?
                                getButton(addNestedButton, () => console.log(1))
                                :
                                null
                        }
                    </Container>
                </Zoom>
            </Stack>
            <Dialog open={isUsersModalOpened} onClose={() => setIsUsersModalOpened(false)} fullScreen>
                <DialogTitle color="primary"
                    sx={{ backgroundColor: theme.palette.secondary.main }}>
                    {
                        task !== null ? task.name : ''
                    }
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: theme.palette.info.main }}>
                    <EventUsersList user={user} users={users}
                        task={task}
                        event_tasks={fields}
                        assigned_users={taskAssignedUsers}
                        assign_callback={(userId, isAssigned, isResponsible) =>
                            assignButtonHandler(userId, isAssigned, isResponsible)} />
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
