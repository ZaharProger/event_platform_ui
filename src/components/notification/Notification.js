import React from 'react'
import { Stack, Typography, useTheme } from '@mui/material'

export default function Notification(props) {
    const theme = useTheme()
    const backgroundColor = theme.palette[props.color].main

    return (
        <Stack direction="column" spacing={2} bgcolor={`${backgroundColor}20`}
            border={`2px solid ${backgroundColor}`} borderRadius="20px"
            padding="20px"
            justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color={props.color} marginRight="auto!important"
                fontWeight="bold">
                {
                    props.header
                }
            </Typography>
            <Stack direction="column" spacing={0} marginRight="auto!important"
                justifyContent="flex-start" alignItems="center">
                {
                    props.data
                }
            </Stack>
        </Stack>
    )
}