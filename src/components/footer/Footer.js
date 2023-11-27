import React from 'react'

import logo from '../../assets/images/logo-full.svg'
import { Stack, SvgIcon, Typography, useTheme } from '@mui/material'

export default function Footer() {
    const theme = useTheme()

    return (
        <Stack spacing={1} justifyContent="center" alignItems="center">
            <SvgIcon component={logo} inheritViewBox />
            <Typography variant="caption" display="block" 
                gutterBottom sx={{color: theme.palette.secondary}}>
                Платформа поддержки организации научных мероприятий
                <br />
                <br />
                2023
            </Typography>
        </Stack>
    )
}
