import React, { useCallback, useState } from 'react'
import { Stack } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import TaskUser from './TaskUser'
import useUsersList from '../../hooks/useUsersList'

export default function TaskUsersSide(props) {
    const { is_visible, users, tasks, task, close_callback,
        text_field_styles, task_tool_styles, update_callback } = props

    const getUsersList = useUsersList(true)

    const getUserAssignation = useCallback((user) => {
        let isAssigned = false

        if (task !== null) {
            if (task.users !== undefined) {
                isAssigned = task.users
                    .filter(taskUser => taskUser.user.id == user.user.id)
                    .length != 0
            }
        }

        return isAssigned
    }, [task])

    const getSearchResults = useCallback((searchData) => {
        let foundData = []

        if (task !== null) {
            if (task.users !== undefined) {
                foundData = searchData == '' ? [...users] : users.filter(eventUser => {
                    return eventUser.user.name.toLowerCase().includes(searchData.toLowerCase())
                })
                foundData = foundData
                    .sort((first, second) => first.user.name.localeCompare(second.user.name))
                    .map(foundUser => {
                        const hasResponsible = task.users
                            .filter(taskUser => taskUser.is_responsible)
                            .length != 0
                        const isResponsible = task.users
                            .filter(taskUser => {
                                return taskUser.is_responsible &&
                                    taskUser.user.id == foundUser.user.id
                            })
                            .length != 0

                        return <TaskUser key={`task_user_${uuidV4()}`} user={foundUser}
                            update_callback={(newData) => update_callback(newData)}
                            related_task_id={task.id} is_responsible={isResponsible} 
                            event_tasks={tasks} has_responsible={hasResponsible}
                            is_assigned={getUserAssignation(foundUser)} />
                    })
            }
        }

        return foundData
    }, [users, task, tasks])

    return (
        <Stack direction="column" spacing={4} display={is_visible ? 'flex' : 'none'}
            justifyContent="center" alignItems="center">
            {
                getUsersList(
                    {text_field_styles, task_tool_styles},
                    `search_${task.id}`, 
                    (searchData) => getSearchResults(searchData),
                    () => close_callback()
                )
            }
        </Stack>
    )
}