import { Stack } from '@mui/material'
import React from 'react'

export default function ListItemButtons(props) {

    return (
        <Stack direction="row" spacing={3}
            justifyContent="center" alignItems="center">
                {
                    props.buttons
                }
        </Stack>
    )
}
