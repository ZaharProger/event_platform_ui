import { Box, Container, useTheme } from '@mui/material'
import React from 'react'

import { createTool, joinTool, showCompletedEventsTool, profileTool } from './toolbar/tools'
import Footer from './footer/Footer'
import Toolbar from './toolbar/Toolbar'
import ContentList from './contentList/ContentList'

export default function App() {
    const theme = useTheme()
    const tools = [
        createTool,
        joinTool,
        showCompletedEventsTool,
        profileTool
    ]

    return (
        <Container maxWidth={false} disableGutters sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '100vh'
        }}>
            <Toolbar tools={tools} />
            <ContentList />
            <Footer />
        </Container>
    )
}
