import React, { useCallback } from 'react'
import {
    Dialog, DialogTitle, DialogContentText, TextField,
    Button, DialogContent, DialogActions, Typography
} from '@mui/material'
import useButton from '../../hooks/useButton'
import { cancelButton, continueButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host } from '../routes'
import useError from '../../hooks/useError'

export default function JoinModal(props) {
    const callApi = useApi()

    const {set: setFieldValue, validate, get: getFieldValue} = useValidation('', /^[A-Z0-9]{8}$/)
    const errorMessage = useError()

    const getCancelButtonColors = useButton()
    const cancelButtonColors = getCancelButtonColors(cancelButton)
    const getContinueButtonColors = useButton()
    const continueButtonColors = getContinueButtonColors(continueButton)

    const textFieldStyles = {
        "& label.Mui-focused": {
            color: `${continueButtonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline:before": {
            borderBottomColor: `${continueButtonColors.backgroundColor}!important`
        },
        "& .MuiInput-underline::after": {
            borderBottomColor: `${continueButtonColors[':hover'].backgroundColor}!important`
        },
        "& .MuiInput-underline:hover:before": {
            borderBottomColor: `${continueButtonColors.backgroundColor}!important`
        }
    }

    const continueButtonHandler = useCallback(() => {
        callApi(`${host}${backendEndpoints.join_event}?secret_code=${getFieldValue()}`, 'GET', null, null)
            .then(responseData => {
                if (responseData.status == 200) {
                    window.location.reload()
                }
                else {
                    errorMessage.set(responseData.data.message)
                }
            })
    }, [getFieldValue()])

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">Присоединиться к мероприятию</DialogTitle>
            <DialogContent>
                <DialogContentText color="secondary">
                    Введите код приглашения, который организатор мероприятия отправил на вашу почту
                </DialogContentText>
                <TextField autoFocus margin="dense"
                    onInput={(event) => setFieldValue(event.target.value)}
                    id="secret_code" label="Код приглашения"
                    fullWidth variant="standard" sx={{ ...textFieldStyles }}
                />
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
                <Button variant="contained"
                    disableElevation
                    sx={{
                        padding: '8px 80px',
                        transition: '0.3s ease-out',
                        ...cancelButtonColors
                    }} onClick={() => props.close_callback()}>
                    {
                        cancelButton.label
                    }
                </Button>
                <Button variant="contained"
                    disabled={!validate()}
                    disableElevation
                    sx={{
                        padding: '8px 80px',
                        transition: '0.3s ease-out',
                        ...continueButtonColors
                    }} onClick={() => continueButtonHandler()}>
                    {
                        continueButton.label
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}
