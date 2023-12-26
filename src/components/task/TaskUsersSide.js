import React, { useState, useCallback } from 'react'
import { useMediaQuery, Stack, TextField } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import useButton from '../../hooks/useButton'
import { backTool } from '../toolbar/tools'
import { searchButton } from '../buttons'
import TaskUser from './TaskUser'

export default function TaskUsersSide(props) {
    const {is_visible, users, tasks, task, close_callback, 
        text_field_styles, task_tool_styles} = props

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
        const foundData = searchData == '' ? users : users.filter(eventUser => {
            return eventUser.user.name.toLowerCase().includes(searchData.toLowerCase())
        })

        return foundData.map(foundUser => {
            return <TaskUser key={`task_user_${uuidV4()}`} user={foundUser} 
                is_assigned={getUserAssignation(foundUser)} />
        })
    }, [searchData, users])

    return (
        <Stack direction="column" spacing={4} display={is_visible? 'flex' : 'none'}
            justifyContent="center" alignItems="center">
            <Stack direction="row" spacing={0} marginRight="auto!important" 
                justifyContent="flex-start" alignItems="center">
                {
                    getTool(backTool, () => close_callback(), task_tool_styles)
                }
            </Stack>
            <Stack direction="column" spacing={1}
                justifyContent="center" alignItems="center">
                <Stack spacing={2} direction={isMobile ? 'column' : 'row'}
                    width="100%" justifyContent="space-between" alignItems="center">
                    <TextField id="search" fullWidth
                        label="ФИО исполнителя" variant="outlined"
                        color="secondary" sx={{ ...text_field_styles }} />
                    {
                        getButton(
                            searchButton,
                            () => setSearchData(
                                document.querySelector('#search').value
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