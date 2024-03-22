import React, { useCallback } from 'react'
import useApi from '../../../hooks/useApi'
import useValidation from '../../../hooks/useValidation'
import useError from '../../../hooks/useError'
import useTextFieldStyles from '../../../hooks/useTextFieldStyles'
import useButton from '../../../hooks/useButton'
import {
    Checkbox,
    Dialog, DialogActions, DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel, TextField, Typography, useTheme
} from '@mui/material'
import { cancelButton, continueButton } from '../../buttons'
import { backendEndpoints, host } from '../../routes'

export default function RegisterModal(props) {
    const theme = useTheme()

    const callApi = useApi()

    const nameValidation = useValidation(
        '',
        /^[A-Za-zА-Яа-я\s-]+$/
    )
    const emailValidation = useValidation(
        '',
        /^[a-z\d._-]+@[a-z\d_-]+\.[a-z]+$/
    )
    const isEventGroupMember = useValidation(true, null)
    const errorMessage = useError()

    const textFieldStyles = useTextFieldStyles('underline')

    const continueButtonHandler = useCallback(() => {
        const formData = {
            name: nameValidation.get(),
            email: emailValidation.get(),
            is_staff: !isEventGroupMember.get(),
            group_name: props.group_name
        }

        callApi(`${host}${backendEndpoints.user_account}`, 'POST', JSON.stringify(formData), {
            'Content-Type': 'application/json'
        })
            .then(responseData => {
                if (responseData.status == 200) {
                    window.location.reload()
                }
                else {
                    errorMessage.set(responseData.data.message)
                }
            })
    }, [nameValidation.get(), emailValidation.get(), isEventGroupMember.get()])

    const getButton = useButton(false)

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">Создать новую группу</DialogTitle>
            <DialogContent>
                <DialogContentText color="secondary">
                    В случае успешной регистрации, пользователь получит на указанную
                    электронную почту логин и пароль для входа
                </DialogContentText>
                <TextField autoFocus margin="dense"
                    onInput={(event) => nameValidation.set(event.target.value)}
                    id="name" label="ФИО пользователя"
                    fullWidth variant="standard" sx={{ ...textFieldStyles }}
                />
                <TextField autoFocus margin="dense"
                    onInput={(event) => emailValidation.set(event.target.value)}
                    id="email" label="E-mail пользователя"
                    fullWidth variant="standard" sx={{ ...textFieldStyles }}
                />
                <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                    control={<Checkbox id="is_staff"
                        onChange={() => isEventGroupMember.set(!isEventGroupMember.get())}
                        checked={isEventGroupMember.get()}
                        sx={{
                            color: theme.palette.secondary.main,
                            "&.Mui-checked": {
                                color: theme.palette.action.main,
                            }
                        }} />}
                    label={<Typography variant="subtitle2"
                        fontSize="0.8em" color="secondary">
                        Участник организационного комитета
                    </Typography>} />
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
            </DialogContent>
            <DialogActions>
                {
                    getButton(cancelButton, () => props.close_callback())
                }
                {
                    getButton(
                        continueButton,
                        () => continueButtonHandler(),
                        () => !(nameValidation.validate() && emailValidation.validate()))
                }
            </DialogActions>
        </Dialog>
    )
}
