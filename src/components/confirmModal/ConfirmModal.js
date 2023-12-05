import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import useButton from '../../hooks/useButton'
import { cancelButton, continueButton } from '../buttons'

export default function ConfirmModal(props) {
    const getButton = useButton()
    const buttons = [
        getButton(cancelButton, () => props.close_callback()),
        getButton(continueButton, () => {
            if (props.confirm_callback !== null) {
                props.confirm_callback()
            }
        })
    ]

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">
                {
                    props.modal_header
                }
            </DialogTitle>
            <DialogContent>
                <DialogContentText color="secondary">
                    {
                        props.modal_content
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    buttons
                }
            </DialogActions>
        </Dialog>
    )
}
