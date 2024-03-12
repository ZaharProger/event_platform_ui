import React, { useCallback } from 'react'
import useApi from '../../../hooks/useApi'
import useValidation from '../../../hooks/useValidation'
import useError from '../../../hooks/useError'
import useTextFieldStyles from '../../../hooks/useTextFieldStyles'
import useButton from '../../../hooks/useButton'
import { Dialog, DialogActions, DialogContent, 
    DialogTitle, TextField, Typography } from '@mui/material'
import { cancelButton, continueButton } from '../../buttons'
import { backendEndpoints, host } from '../../routes'

export default function CreateGroupModal(props) {
    const callApi = useApi()

    const {set: setFieldValue, validate, get: getFieldValue} = useValidation('', /[А-Яа-яA-Za-z\s\-.,_]+/)
    const errorMessage = useError()

    const textFieldStyles = useTextFieldStyles('underline')

    const continueButtonHandler = useCallback(() => {
        const formData = {
            name: getFieldValue()
        }

        callApi(`${host}${backendEndpoints.user_groups}`, 'POST', JSON.stringify(formData), {
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
    }, [getFieldValue()])

    const getButton = useButton(false)

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">Создать новую группу</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense"
                    onInput={(event) => setFieldValue(event.target.value)}
                    id="name" label="Наименование группы"
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
