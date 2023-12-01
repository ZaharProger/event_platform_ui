import React from 'react'
import {
    Dialog, DialogTitle, DialogContent,
    Typography, Button, DialogActions
} from '@mui/material'

import { closeButton } from '../buttons'
import useButton from '../../hooks/useButton'
import EventLongInfo from '../event/EventLongInfo'

export default function MoreModal(props) {
    const getCloseButtonColors = useButton()
    const closeButtonColors = getCloseButtonColors(closeButton)

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="secondary">{props.data.event_info.name}</DialogTitle>
            <DialogContent>
                <EventLongInfo data={{
                    event_info: props.data.event_info,
                    user: props.data.user
                }} />
            </DialogContent>
            <DialogActions>
                <Button variant="contained"
                    disableElevation
                    sx={{
                        padding: '8px 80px',
                        transition: '0.3s ease-out',
                        ...closeButtonColors
                    }} onClick={() => props.close_callback()}>
                    {
                        closeButton.label
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}
