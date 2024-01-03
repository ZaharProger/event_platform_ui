import React, { useCallback } from 'react'
import { Fade, Stack } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import useUsersList from '../../hooks/useUsersList'
import UsersListItem from '../usersList/UsersListItem'

export default function TaskUsersSide(props) {
    const { is_visible, users, tasks, task, close_callback,
        text_field_styles, task_tool_styles, assignation } = props

    const getUsersList = useUsersList(true)

    const getUserAssignation = useCallback((user) => {
        let isAssigned = false

        if (task !== null) {
            if (task.users !== undefined) {
                const foundAssignation = assignation.filter(item => item.id == task.id)
                if (foundAssignation.length != 0) {
                    isAssigned = foundAssignation[0].users
                        .filter(itemUser => itemUser.user.id == user.user.id)
                        .length != 0
                }
            }
        }

        return isAssigned
    }, [task, assignation])

    const getSearchResults = useCallback((searchData) => {
        let foundData = []

        if (task !== null) {
            if (task.users !== undefined) {
                const hasResponsible = assignation
                    .filter(item => {
                        return item.id == task.id && item.users
                            .filter(taskUser => taskUser.is_responsible)
                            .length != 0
                    })
                    .length != 0

                foundData = searchData == '' ? [...users] : users.filter(eventUser => {
                    return eventUser.user.name.toLowerCase().includes(searchData.toLowerCase())
                })
                foundData = foundData
                    .sort((first, second) => first.user.name.localeCompare(second.user.name))
                    .map(foundUser => {
                        const isResponsible = assignation
                            .filter(item => {
                                return item.id == task.id && item.users
                                    .filter(taskUser => taskUser.is_responsible &&
                                        taskUser.user.id == foundUser.user.id)
                                    .length != 0
                            })
                            .length != 0

                        return <UsersListItem key={`task_user_${uuidV4()}`} user={foundUser}
                            related_task_id={task.id}
                            assignation={assignation}
                            is_responsible={isResponsible}
                            for_task={true}
                            event_tasks={tasks} has_responsible={hasResponsible}
                            is_assigned={getUserAssignation(foundUser)} />
                    })
            }
        }

        return foundData
    }, [users, task, tasks, assignation])

    return (
        <Fade in={is_visible} timeout={1500}>
            <Stack direction="column" spacing={4} display={is_visible ? 'flex' : 'none'}
                justifyContent="center" alignItems="center">
                {
                    getUsersList(
                        { text_field_styles, task_tool_styles },
                        `search_${task.id}`,
                        (searchData) => getSearchResults(searchData),
                        () => close_callback()
                    )
                }
            </Stack>
        </Fade>
    )
}