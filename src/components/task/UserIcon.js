import React from 'react'
import { Box, Tooltip, Typography, useTheme } from '@mui/material'

import { v4 as uuidV4 } from "uuid"

export default function UserIcon(props) {
    const theme = useTheme()

    const splittedName = props.username.split(' ')

    return (
        <Tooltip title={props.username}>
            <Box key={`task_user_${uuidV4()}`} borderRadius="100%"
                bgcolor={theme.palette.secondary.main} padding="10px">
                <Typography color="primary" fontSize="0.5em" textAlign="center">
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
