import React from 'react'

import {
    Dialog, DialogTitle, Stack,
    DialogContent, DialogActions, useTheme
} from '@mui/material'
import useButton from '../../../hooks/useButton'
import { cancelButton, continueButton } from '../../buttons'
import ModalBlockItem from '../ModalBlockItem'

export default function FilterModal(props) {
    const theme = useTheme()

    const getButton = useButton(false)
    const buttons = [
        getButton(cancelButton, () => props.close_callback()),
        getButton(continueButton, () => {
            if (props.confirm_callback !== null) {
                props.confirm_callback(Array())
            }
        })
    ]

    const colors = [
        'info',
        'action',
        'success'
    ]
    const taskStates = localStorage.getItem('task_states') !== null ?
        JSON.parse(localStorage.getItem('task_states'))
            .map((taskState, i) => {
                return {
                    value: taskState.value,
                    color: colors[i]
                }
            })
        :
        []
    taskStates.push({
        value: 'С задержкой',
        color: 'error'
    })

    // Tasks period
    // User tasks
    // Other users tasks
    return (
        <Dialog open={props.is_opened} onClose={props.close_callback}>
            <DialogTitle color="primary" marginBottom="20px"
                sx={{backgroundColor: theme.palette.secondary.main}}>
                Фильтры
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} overflow="auto" maxHeight="600px"
                    justifyContent="flex-start" alignItems="center">
                    <ModalBlockItem
                        type={'checkbox'}
                        item_name={'Статус задач'}
                        item_values={taskStates} />
                    <ModalBlockItem
                        type={'date'}
                        item_name={'Сроки задач'}
                        item_values={[
                            'Дата начала',
                            'Дата окончания'
                        ]} />
                    <ModalBlockItem
                        type={'list'}
                        item_name={'Исполнители'}
                        item_values={props.event_users} />
                </Stack>
            </DialogContent>
            <DialogActions>
                {
                    buttons
                }
            </DialogActions>
        </Dialog>
    )
}
