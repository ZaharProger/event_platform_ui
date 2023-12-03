import React, { useCallback } from 'react'
import {
    Dialog, DialogTitle, DialogContentText, TextField,
    DialogContent, DialogActions, Typography
} from '@mui/material'
import useButton from '../../hooks/useButton'
import { cancelButton, continueButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host } from '../routes'
import useError from '../../hooks/useError'
import useColors from '../../hooks/useColors'

export default function JoinModal(props) {
    const callApi = useApi()

    const {set: setFieldValue, validate, get: getFieldValue} = useValidation('', /^[A-Z0-9]{8}$/)
    const errorMessage = useError()

    const getButtonColors = useColors()
    const buttonColors = getButtonColors(continueButton)

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

    const getButton = useButton(false)

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
                {
                    getButton(cancelButton, () => props.close_callback())
                }
                {
                    getButton(continueButton, () => continueButtonHandler(), () => !validate())
                }
            </DialogActions>
        </Dialog>
    )
}
