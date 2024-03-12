import { Stack, Typography } from '@mui/material'
import React from 'react'

export default function GroupShortInfo(props) {
    const {name} = props.data.group_info
    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center" width="100%">
            <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                display="block" sx={{ fontWeight: 'bold' }}>
                {name}
            </Typography>
        </Stack>
    )
}
