import { Stack, Typography, TextField, Grid, useMediaQuery } from '@mui/material'
import React, { useCallback } from 'react'

import useButton from '../../hooks/useButton'
import { resetButton, saveButton, signOutButton } from '../buttons'
import { backTool } from '../toolbar/tools'
import useApi from '../../hooks/useApi'
import { host, backendEndpoints, routes } from '../routes'
import { useNavigate } from 'react-router-dom'
import useValidation from '../../hooks/useValidation'
import useError from '../../hooks/useError'
import useColors from '../../hooks/useColors'

export default function Profile(props) {
    const nameValidation = useValidation(
        props.data !== null ? props.data.user.name : '',
        /^[A-Za-zА-Яа-я\s-]+$/
    )
    const emailValidation = useValidation(
        props.data !== null ? props.data.user.email : '',
        /^[a-z\d._-]+@[a-z\d_-]+\.[a-z]+$/
    )

    const errorMessage = useError()

    const callApi = useApi()
    const navigate = useNavigate()

    const isMobile = useMediaQuery('(max-width: 1000px)')
    
    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&:hover fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&.Mui-focused fieldset': {
                borderColor: buttonColors[':hover'].backgroundColor,
            },
        }
    }

    const saveButtonHandler = useCallback(() => {
        const jsonData = {}
        document.querySelector('.Profile').querySelectorAll('input').forEach(input => {
            jsonData[input.id] = input.value
        })

        callApi(`${host}${backendEndpoints.user_account}`, 'PUT', JSON.stringify(jsonData), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                errorMessage.set(null)
                window.location.reload()
            }
            else {
                errorMessage.set(responseData.data.message)
            }
        })
    }, [])

    const signOutButtonHandler = useCallback(() => {
        callApi(`${host}${backendEndpoints.logout}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                navigate(routes.auth)
            }
        })
    }, [])

    const getButton = useButton(false)
    const getTool = useButton(true)

    return (
        <Stack className="Profile" direction="column" spacing={5} padding="20px">
            <Stack direction="row" spacing={2}>
                <Typography variant="h6" color='secondary'
                    gutterBottom textAlign='start' margin="auto!important">
                    Ваш профиль
                </Typography>
                {
                    getTool(backTool, () => props.close_callback())
                }
            </Stack>
            <Grid direction="row" container>
                <Grid direction="column" spacing={3} item container>
                    <Grid item>
                        <Typography variant="body1" display="flex" color='secondary'
                            gutterBottom marginRight="auto!important"
                            textAlign='start' fontWeight="bold">
                            Настройки
                        </Typography>
                    </Grid>
                    <Grid direction="row" md spacing={3} item container>
                        <Grid item marginTop="40px" width="400px">
                            <Stack direction="column" spacing={2}>
                                <TextField id="name" required
                                    onInput={(event) => nameValidation.set(event.target.value)}
                                    defaultValue={props.data !== null ? props.data.user.name : ''}
                                    fullWidth label="ФИО" variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="email" fullWidth required
                                    onInput={(event) => emailValidation.set(event.target.value)}
                                    defaultValue={props.data !== null ? props.data.user.email : ''}
                                    label="E-mail" variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                            </Stack>
                        </Grid>
                        <Grid item width="500px">
                            <Stack direction="column" spacing={2}>
                                <TextField id="phone" label="Номер телефона" variant="outlined"
                                    defaultValue={props.data !== null ? props.data.user.phone : ''}
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="telegram" label="Аккаунт Telegram" variant="outlined"
                                    defaultValue={props.data !== null ? props.data.user.telegram : ''}
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="organization" fullWidth
                                    defaultValue={props.data !== null ? props.data.user.organization : ''}
                                    label="Организация" variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {
                            getButton(
                                saveButton, 
                                () => saveButtonHandler(), 
                                () => !(nameValidation.validate() && emailValidation.validate())
                            )
                        }
                    </Grid>
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
                </Grid>
            </Grid>
            <Stack direction="column" spacing={2}>
                <Typography variant="body1" display="flex" color='secondary'
                    gutterBottom marginRight="auto!important"
                    textAlign='start' fontWeight="bold">
                    Дополнительно
                </Typography>
                <Stack direction="row" useFlexGap flexWrap="wrap"
                    marginLeft="auto!important" spacing={2}>
                    {
                        getButton(resetButton, () => console.log(1), null, {
                            width: isMobile ? '100%' : 'auto'
                        })
                    }
                    {
                        getButton(signOutButton, () => signOutButtonHandler(), null, {
                            width: isMobile ? '100%' : 'auto'
                        })
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}
