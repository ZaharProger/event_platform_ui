import { Stack, TextField, useMediaQuery } from '@mui/material'
import React from 'react'

import { searchButton } from '../buttons'
import { backTool } from '../toolbar/tools'
import useButton from '../../hooks/useButton'

export default function UsersList(props) {
    const isMobile = useMediaQuery('(max-width: 1000px)')

    const getTool = useButton(true)
    const getButton = useButton(false)

    return (
        <Stack direction="column" spacing={1}
            justifyContent="center" alignItems="center">
            <Stack spacing={2} direction={isMobile ? 'column' : 'row'}
                width="100%" justifyContent="space-between" alignItems="center">
                {
                    props.has_back ?
                        getTool(backTool, () => props.close_callback(), props.task_tool_styles)
                        :
                        null
                }
                <TextField id={props.search_field_id} fullWidth
                    label="ФИО исполнителя" variant="outlined"
                    color="secondary" sx={{ ...props.text_field_styles }} />
                {
                    getButton(
                        searchButton,
                        () => props.search_callback()
                    )
                }
            </Stack>
            <Stack direction="column" spacing={4}
                sx={{
                    ...props.task_tool_styles,
                    padding: '10px'
                }}
                width="100%"
                height={props.for_modal? "300px" : "500px"}
                overflow="auto"
                alignItems="center">
                {
                    props.users_data
                }
            </Stack>
        </Stack>
    )
}