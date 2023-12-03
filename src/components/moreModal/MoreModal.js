import React from 'react'
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, useTheme
} from '@mui/material'

import { closeButton } from '../buttons'
import useButton from '../../hooks/useButton'
import EventLongInfo from '../event/EventLongInfo'

export default function MoreModal(props) {
    const theme = useTheme()
    const getButton = useButton(false)

    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="primary" marginBottom="20px"
            sx={{backgroundColor: theme.palette.secondary.main}}>
                {
                    props.data.event_info.name
                }
            </DialogTitle>
            <DialogContent>
                <EventLongInfo data={{
                    event_info: props.data.event_info,
                    user: props.data.user
                }} />
            </DialogContent>
            <DialogActions>
                {
                    getButton(closeButton, () => props.close_callback())
                }
            </DialogActions>
        </Dialog>
    )
}
