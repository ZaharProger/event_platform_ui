import React from 'react'
import { Box, Tooltip, Typography, useTheme } from '@mui/material'

export default function UserIcon(props) {
    const theme = useTheme()

    const splittedName = props.username.split(' ')
    const iconColor = props.is_responsible? theme.palette.secondary.main : theme.palette.primary.main
    const textColor = props.is_responsible? theme.palette.primary.main : theme.palette.secondary.main

    const tooltipTitle = `${props.username}${props.is_responsible? ' (Ответственное лицо)' : ''}`

    return (
        <Tooltip title={tooltipTitle}>
            <Box borderRadius="100%"
                border="2px solid"
                borderColor={theme.palette.secondary.main}
                bgcolor={iconColor} padding="10px">
                <Typography color={textColor} fontSize="0.5em" textAlign="center">
                    {
                        splittedName.length == 1 ?
                            splittedName[0].substring(0, 1).toUpperCase()
                            :
                            [splittedName[0], splittedName[1]]
                                .map(namePart => namePart.substring(0, 1).toUpperCase())
                                .join('')
                    }
                </Typography>
            </Box>
        </Tooltip>
    )
}
