import React, { useState, useCallback } from 'react'
import { useMediaQuery, Stack, TextField } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import useButton from '../../hooks/useButton'
import { backTool } from '../toolbar/tools'
import { searchButton } from '../buttons'
import TaskUser from './TaskUser'

export default function TaskUsersSide(props) {
    const { is_visible, users, tasks, task, close_callback,
        text_field_styles, task_tool_styles, update_callback } = props

    const isMobile = useMediaQuery('(max-width: 1000px)')

    const getTool = useButton(true)
    const getButton = useButton(false)

    const [searchData, setSearchData] = useState('')

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

    const getSearchResults = useCallback(() => {
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
    }, [searchData, users, task, tasks, update_callback])

    return (
        <Stack direction="column" spacing={4} display={is_visible ? 'flex' : 'none'}
            justifyContent="center" alignItems="center">
            <Stack direction="column" spacing={1}
                justifyContent="center" alignItems="center">
                <Stack spacing={2} direction={isMobile ? 'column' : 'row'}
                    width="100%" justifyContent="space-between" alignItems="center">
                    {
                        getTool(backTool, () => close_callback(), task_tool_styles)
                    }
                    <TextField id={`search_${task.id}`} fullWidth
                        label="ФИО исполнителя" variant="outlined"
                        color="secondary" sx={{ ...text_field_styles }} />
                    {
                        getButton(
                            searchButton,
                            () => setSearchData(
                                document.querySelector(`#search_${task.id}`).value
                            )
                        )
                    }
                </Stack>
                <Stack direction="column" spacing={4}
                    sx={{
                        ...task_tool_styles,
                        padding: '10px'
                    }}
                    width="100%"
                    height="300px"
                    overflow="auto"
                    alignItems="center">
                    {
                        getSearchResults()
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}