import { Stack, Typography, Button, TextField, Grid, useMediaQuery } from '@mui/material'
import React, { useCallback } from 'react'

import useButton from '../../hooks/useButton'
import { resetButton, saveButton, signOutButton } from '../buttons'
import Tool from '../toolbar/Tool'
import { backTool } from '../toolbar/tools'
import useApi from '../../hooks/useApi'
import { host, backendEndpoints, routes } from '../routes'
import { useNavigate } from 'react-router-dom'

export default function Profile(props) {
    const callApi = useApi()
    const navigate = useNavigate()

    const isMobile = useMediaQuery('(max-width: 1000px)')

    const getSaveButtonColors = useButton()
    const getResetButtonColors = useButton()
    const getSignOutButtonColors = useButton()

    const saveButtonColors = getSaveButtonColors(saveButton)
    const resetButtonColors = getResetButtonColors(resetButton)
    const signOutButtonColors = getSignOutButtonColors(signOutButton)
  
    backTool.callback = () => props.close_callback()

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: saveButtonColors.backgroundColor,
          },
          '&:hover fieldset': {
            borderColor: saveButtonColors.backgroundColor,
          },
          '&.Mui-focused fieldset': {
            borderColor: saveButtonColors[':hover'].backgroundColor,
          },
        }
    }

    const signOutButtonHandler = useCallback(() => {
        callApi(`${host}${backendEndpoints.logout}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                navigate(routes.auth)
            }
        })
    }, [])

    return (
        <Stack direction="column" spacing={5} padding="20px">
            <Stack direction="row" spacing={2}>
                <Typography variant="h6" color='secondary'
                    gutterBottom textAlign='start' margin="auto!important">
                        Ваш профиль
                </Typography>
                <Tool data={backTool} />
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
                                <TextField id="name" fullWidth label="ФИО" variant="outlined" 
                                    color="secondary" sx={{...textFieldStyles}} />
                                <TextField id="email" fullWidth label="E-mail" variant="outlined" 
                                    color="secondary" sx={{...textFieldStyles}} />
                            </Stack>
                        </Grid>
                        <Grid item width="500px">
                            <Stack direction="column" spacing={2}>
                                <TextField id="phone" label="Номер телефона" variant="outlined" 
                                    color="secondary" sx={{...textFieldStyles}} />
                                <TextField id="telegram" label="Аккаунт Telegram" variant="outlined" 
                                    color="secondary" sx={{...textFieldStyles}} />
                                <TextField id="organization" fullWidth 
                                    label="Организация" variant="outlined" 
                                    color="secondary" sx={{...textFieldStyles}} />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"
                            disableElevation 
                            sx={{
                                fontSize: '0.8em',
                                padding: '8px 50px',
                                transition: '0.3s ease-out',
                                ...saveButtonColors
                            }} onClick={() => saveButtonHandler()}>
                            {
                                saveButton.label
                            }
                        </Button>
                    </Grid>
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
                    <Button variant="contained"
                        disableElevation 
                        sx={{
                            width: isMobile? '100%' : 'auto',
                            fontSize: '0.8em',
                            padding: '8px 80px',
                            transition: '0.3s ease-out',
                            ...resetButtonColors
                        }} onClick={() => resetButtonHandler()}>
                        {
                           resetButton.label
                        }
                    </Button>
                    <Button variant="contained"
                        disableElevation 
                        sx={{
                            width: isMobile? '100%' : 'auto',
                            fontSize: '0.8em',
                            padding: '8px 80px',
                            transition: '0.3s ease-out',
                            ...signOutButtonColors
                        }} onClick={() => signOutButtonHandler()}>
                        {
                            signOutButton.label
                        }
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
