import { Stack } from '@mui/material'
import React from 'react'

export default function ContentList(props) {
    return (
        <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
            {
                props.data
            }
        </Stack>
    )
}
