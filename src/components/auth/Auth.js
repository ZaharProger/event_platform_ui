import { Stack, Icon, Button, TextField, Container, useTheme, Fade, Typography } from '@mui/material'
import React, { useState } from 'react'

import logo from '../../assets/images/logo-full.svg'
import useButton from '../../hooks/useButton'
import { signInButton } from '../buttons'
import { helpTool, backTool } from '../toolbar/tools'
import Tool from '../toolbar/Tool'

export default function Auth() {
    const [isHelpOpened, setIsHelpOpened] = useState(false)

    const theme = useTheme()

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

    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.info.main,
            borderRadius: '100%',
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
                                variant="standard" color="secondary" sx={{...textFieldStyles}} />
                            <TextField id="password" label="Ваш пароль" 
                                variant="standard" color="secondary" sx={{...textFieldStyles}} />
                        </Stack>
                        <Button variant="contained" disableElevation sx={{
                            padding: '8px 20px',
                            width: '100%',
                            transition: '0.3s ease-out',
                            ...buttonColors
                            }}>
                                Войти
                        </Button>
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
