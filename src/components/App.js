import { Container, useTheme } from '@mui/material'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import ContentWrap from './content/ContentWrap'
import { routes } from './routes'
import NotFound from './notFound/NotFound'
import Auth from './auth/Auth'

export default function App() {
    const theme = useTheme()

    return (
        <Container maxWidth={false} disableGutters sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '100vh'
        }}>
            <Routes>
                <Route path={routes.home} element={<ContentWrap />} />
                <Route path={routes.auth} element={<Auth />} />
                <Route path={routes.create_event} element={<ContentWrap />} />
                <Route path={`${routes.event_card}:id`} element={<ContentWrap />} />
                <Route path='*'
                    element={<NotFound additional_caption={'Запрашиваемый ресурс не существует'} />} />
            </Routes>
        </Container>
    )
}
