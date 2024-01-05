import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import useButton from '../../../hooks/useButton'
import { cancelButton, continueButton } from '../../buttons'
import useSync from '../../../hooks/useSync'

export default function ConfirmModal(props) {
    const syncFunction = useSync()

    const getButton = useButton(false)
    const buttons = [
        getButton(cancelButton, () => props.close_callback()),
        getButton(continueButton, () => {
            if (props.confirm_callback !== null) {
                props.confirm_callback((isRoadmap, actualData, currentData, excludeId) => {
                    return syncFunction(isRoadmap, actualData, currentData, excludeId)
                })
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
