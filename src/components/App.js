import { Container, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import ContentWrap from './content/ContentWrap'
import { backendEndpoints, host, routes } from './routes'
import NotFound from './notFound/NotFound'
import Auth from './auth/Auth'
import useApi from '../hooks/useApi'
import { changeData, changeUser } from '../redux/actions'

export default function App() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user)
    const callApi = useApi()
    const theme = useTheme()

    useEffect(() => {
        callApi(`${host}${backendEndpoints.user_account}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                callApi(`${host}${backendEndpoints.events}`, 'GET', null, null).then(resData => {
                    dispatch(changeData(resData.status == 200? resData.data.data : Array()))
                })
                if (responseData.data !== userData) {
                    dispatch(changeUser(responseData.data.data))
                }
                if (location.pathname === routes.auth) {
                    navigate(routes.home)
                }
            }
            else {
                if (location.pathname !== routes.auth) {
                    dispatch(changeUser(null))
                    navigate(routes.auth)
                }
            }
        })
    }, [location.pathname])

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
                <Route path='*'
                    element={<NotFound additional_caption={'Запрашиваемый ресурс не существует'} />} />
            </Routes>
        </Container>
    )
}
