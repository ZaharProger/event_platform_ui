import { Stack, Icon, TextField, Container, useTheme, Fade, Typography, useMediaQuery } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../assets/images/logo-full.svg'
import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import { signInButton } from '../buttons'
import { helpTool, backTool } from '../toolbar/tools'
import useValidation from '../../hooks/useValidation'
import useError from '../../hooks/useError'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host, routes } from '../routes'

export default function Auth() {
    const [isHelpOpened, setIsHelpOpened] = useState(false)
    const usernameValidation = useValidation('', /^[A-Za-z0-9!]+$/)
    const passwordValidation = useValidation('', /^[A-Za-z0-9!]+$/)
    const errorMessage = useError()

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const theme = useTheme()

    const callApi = useApi()
    const navigate = useNavigate()

    const authButtonHandler = useCallback(() => {
        const formData = new FormData()
        document.querySelectorAll('input').forEach(input => {
            formData.set(input.id, input.value)
        })

        callApi(`${host}${backendEndpoints.auth}`, 'POST', formData, null).then(responseData => {
            if (responseData.status == 200) {
                errorMessage.set(null)
                navigate(routes.home)
            }
            else {
                errorMessage.set(responseData.data.message)
            }
        })
    }, [isHelpOpened])

    const getButton = useButton(false)
    const getTool = useButton(true)
    const getColors = useColors()
    const button = getButton(
        signInButton,
        () => authButtonHandler(),
        () => !(usernameValidation.validate() && passwordValidation.validate())
    )
    const buttonColors = getColors(signInButton)
    const backToolComponent = getTool(backTool, () => setIsHelpOpened(false))
    const helpToolComponent = getTool(helpTool, () => setIsHelpOpened(true))

    const textFieldStyles = {
        "& label.Mui-focused": {
            color: `${buttonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline:before": {
            borderBottomColor: `${buttonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline::after": {
            borderBottomColor: `${buttonColors[':hover'].backgroundColor}!important`
        },
        "& .MuiInput-underline:hover:before": {
            borderBottomColor: `${buttonColors.backgroundColor}!important`
        }
    }

    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.info.main,
            borderRadius: isMobile ? '0' : '100%',
            padding: '50px 100px',
            margin: 'auto',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'visible',
            transition: '0.8s ease-out',
            transform: isHelpOpened ? 'rotateY(360deg)' : 'none'
        }}>
            <Stack direction="column" spacing={3} display="flex"
                margin="50px auto auto auto"
                justifyContent="center" alignItems="center">
                <Fade in={!isHelpOpened} timeout={2500}>
                    <Stack direction="column" spacing={5} justifyContent="center"
                        alignItems="center" display={isHelpOpened ? 'none' : 'flex'}>
                        <Icon sx={{ transform: 'scale(2.5)', width: 100 }}>
                            <img src={logo} />
                        </Icon>
                        <Stack direction="column" spacing={1}
                            justifyContent="center" alignItems="center">
                            <TextField id="username" label="Ваш логин"
                                onInput={(event) => usernameValidation.set(event.target.value)}
                                variant="standard" color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="password" label="Ваш пароль" type="password"
                                onInput={(event) => passwordValidation.set(event.target.value)}
                                variant="standard" color="secondary" sx={{ ...textFieldStyles }} />
                        </Stack>
                        {
                            button
                        }
                        {
                            errorMessage.get() !== null ?
                                <Typography variant="subtitle2" display="block"
                                    color="error" textAlign="center">
                                    {
                                        errorMessage.get()
                                    }
                                </Typography>
                                :
                                null
                        }
                    </Stack>
                </Fade>
                <Fade in={isHelpOpened} timeout={2500}>
                    <Stack direction="column" spacing={2} display={isHelpOpened ? 'flex' : 'none'}
                        sx={{ transform: 'translateY(-50px)' }}
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
                {
                    isHelpOpened ? backToolComponent : helpToolComponent
                }
            </Stack>
        </Container>
    )
}
