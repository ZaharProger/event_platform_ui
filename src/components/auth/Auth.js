import { Stack, Icon, Button, TextField, Container, useTheme, Fade, Typography, useMediaQuery } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../assets/images/logo-full.svg'
import useButton from '../../hooks/useButton'
import { signInButton } from '../buttons'
import { helpTool, backTool } from '../toolbar/tools'
import Tool from '../toolbar/Tool'
import useValidation from '../../hooks/useValidation'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host, routes } from '../routes'

export default function Auth() {
    const [isHelpOpened, setIsHelpOpened] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorResponse, setErrorResponse] = useState(null)

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const theme = useTheme()
    const validate = useValidation(/^[A-Za-z0-9!]+$/)

    const callApi = useApi()
    const navigate = useNavigate()

    const getButtonColors = useButton()
    const buttonColors = getButtonColors(signInButton)

    const textFieldStyles = {
        "& label.Mui-focused": {
            color: `${buttonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: `${buttonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline:hover:before": {
            borderBottomColor: `${buttonColors.backgroundColor}!important`
        }
    }

    const authButtonHandler = useCallback(() => {
        const formData = new FormData()
        document.querySelectorAll('input').forEach(input => {
            formData.set(input.id, input.value)
        })

        callApi(`${host}${backendEndpoints.auth}`, 'POST', formData, null).then(responseData => {
            if (responseData.status == 200) {
                setErrorResponse(null)
                navigate(routes.home)
            }
            else {
                setErrorResponse(responseData.data.message)
            }
        })
    }, [username, password, isHelpOpened])

    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.info.main,
            borderRadius: isMobile? '0' : '100%',
            padding: '50px 100px',
            margin: 'auto'
        }}>
            <Stack direction="column" spacing={0} display="flex" margin="50px auto auto auto"
                justifyContent="center" alignItems="center">
                <Fade in={!isHelpOpened}>
                    <Stack direction="column" spacing={5} justifyContent="center" alignItems="center">
                        <Icon sx={{transform: 'scale(2.5)', width: 100}}>
                            <img src={logo} />
                        </Icon>
                        <Stack direction="column" spacing={1} 
                            justifyContent="center" alignItems="center">
                            <TextField id="username" label="Ваш логин"
                                onInput={(event) => setUsername(event.target.value)}
                                variant="standard" color="secondary" sx={{...textFieldStyles}} />
                            <TextField id="password" label="Ваш пароль" type="password"
                                onInput={(event) => setPassword(event.target.value)}
                                variant="standard" color="secondary" sx={{...textFieldStyles}} />
                        </Stack>
                        <Button variant="contained" 
                            disabled={!(validate(username) && validate(password))} 
                            disableElevation 
                            sx={{
                                padding: '8px 80px',
                                transition: '0.3s ease-out',
                                ...buttonColors
                            }} onClick={() => authButtonHandler()}>
                            {
                                signInButton.label
                            }
                        </Button>
                        {
                            errorResponse !== null?
                            <Typography variant="subtitle2" display="block" 
                                color="error" textAlign="center">
                                {
                                    errorResponse
                                }
                            </Typography>
                            :
                            null
                        }
                    </Stack>
                </Fade>
                <Fade in={isHelpOpened}>
                    <Stack direction="column" spacing={2} sx={{transform: 'translateY(-200px)'}}
                        justifyContent="center" alignItems="center">
                        <Typography variant="subtitle2" display="block" 
                            color="secondary" textAlign="center"
                            fontSize="1.2em" fontWeight="bold">
                            Как войти в систему?
                        </Typography>
                        <Typography variant="subtitle2" display="block" 
                            textAlign="center" color="secondary">
                            Для входа в систему необходимо ввести логин и пароль, полученные
                            от вашего администратора
                        </Typography>
                    </Stack>
                </Fade>
                <Tool data={{
                    tool: isHelpOpened? backTool : helpTool,
                    callback: () => setIsHelpOpened(!isHelpOpened)
                }} />
            </Stack>
        </Container>
    )
}
