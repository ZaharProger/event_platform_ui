import React, { useCallback, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContentText, TextField,
    DialogContent, DialogActions, Typography
} from '@mui/material'
import useButton from '../../../hooks/useButton'
import { cancelButton, continueButton } from '../../buttons'
import useTextFieldStyles from '../../../hooks/useTextFieldStyles'
import useError from '../../../hooks/useError'
import useApi from '../../../hooks/useApi'
import useRoute from '../../../hooks/useRoute'
import { backendEndpoints, host } from '../../routes'

export default function UploadModal(props) {
    const textFieldStyles = useTextFieldStyles('underline')
    const errorMessage = useError()
    const callApi = useApi()
    const navigate = useRoute()

    const continueButtonHandler = useCallback(() => {
        const formData = new FormData()
        formData.append('upload', 'true')
        formData.append('group_name', props.group_name)
        formData.append('doc_template', document.getElementById('doc-template').files[0])
        formData.append('doc_name', props.doc_name)

        callApi(`${host}${backendEndpoints.templates}`, 'POST', formData, null, true)
            .then(responseData => {
                if (responseData.status == 200) {
                    navigate(null)
                }
            })
    }, [props])

    const getButton = useButton(false)

    const [hasFile, setHasFile] = useState(false)

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">Загрузить шаблон документа</DialogTitle>
            <DialogContent>
                <DialogContentText color="secondary">
                    Прикрепите новый шаблон для выбранного документа
                </DialogContentText>
                <TextField autoFocus margin="dense"
                    onChange={(e) => setHasFile(e.target.files.length != 0)}
                    id="doc-template" label="Файл шаблона"
                    type="file" fullWidth variant="standard" sx={{ ...textFieldStyles }}
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
                    getButton(continueButton, () => continueButtonHandler(), () => !hasFile)
                }
            </DialogActions>
        </Dialog>
    )
}
