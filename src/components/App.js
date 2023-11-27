import { Container, useTheme } from '@mui/material'
import React from 'react'

import { createTool, joinTool, showCompletedEventsTool, profileTool } from './tools'
import Footer from './footer/Footer'
import Toolbar from './toolbar/Toolbar'

export default function App() {
    const theme = useTheme()
    const tools = [
        createTool,
        joinTool,
        showCompletedEventsTool,
        profileTool
    ]

    return (
        <Container maxWidth="sm" sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Toolbar tools={tools} />
            <ContentList />
            <Footer />
        </Container>
    )
}
