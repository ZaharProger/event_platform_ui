import React from 'react'

import logo from '../../assets/images/logo-full.svg'
import { Stack, Icon, Typography, Box } from '@mui/material'

export default function Footer() {
    return (
        <Box display="flex" marginTop="auto" flexDirection="column">
            <Stack spacing={2} justifyContent="center" alignItems="center">
                <Icon sx={{transform: 'scale(1.8)', width: 100}}>
                    <img src={logo} />
                </Icon>
                <Typography variant="caption" display="block" color='secondary'
                    gutterBottom textAlign='center'>
                    Платформа поддержки организации мероприятий
                    <br />
                    { new Date().getFullYear() }
                </Typography>
            </Stack>
        </Box>
    )
}
