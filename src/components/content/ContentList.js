import { Stack } from '@mui/material'
import React from 'react'

export default function ContentList(props) {
    return (
        <Stack spacing={8} direction="column" justifyContent="center" alignItems="center" width="100%">
            {
                props.data
            }
        </Stack>
    )
}
