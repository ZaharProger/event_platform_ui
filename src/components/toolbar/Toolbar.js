import { Stack } from '@mui/material'
import React from 'react'

export default function Toolbar(props) {
    return (
        <Stack direction="row" spacing={5} sx={{ margin: '30px 50px 10px 30px' }} 
            useFlexGap
            alignItems="center">
            {
                props.tools
            }
        </Stack>
    )
}
