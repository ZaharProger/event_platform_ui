import React from 'react'

import {
    Dialog, DialogTitle, Stack,
    DialogContent, DialogActions, useTheme
} from '@mui/material'
import useButton from '../../../hooks/useButton'
import { applyButton, cancelButton } from '../../buttons'
import ModalBlockItem from '../ModalBlockItem'
import { useSelector } from 'react-redux'

export default function FilterModal(props) {
    const theme = useTheme()

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

    const filterUsers = useSelector(state => state.filter_users)
    const filterStates = useSelector(state => state.filter_states)

    const getButton = useButton(false)
    const buttons = [
        getButton(cancelButton, () => props.close_callback()),
        getButton(applyButton, () => {
            if (props.confirm_callback !== null) {
                const filterList = {}

                if (filterUsers.length != 0) {
                    filterList.users = [...filterUsers]
                }
                if (filterStates.length != 0) {
                    filterList.task_states = [...filterStates]
                }

                props.confirm_callback(filterList)
            }
        })
    ]

    return (
        <Dialog id="Filter-modal" open={props.is_opened}
            onClose={props.close_callback}>
            <DialogTitle color="primary"
                sx={{ backgroundColor: theme.palette.secondary.main }}>
                Фильтры
            </DialogTitle>
            <DialogContent>
                <Stack spacing={4} overflow="auto" maxHeight="1000px"
                    justifyContent="flex-start" alignItems="center">
                    <ModalBlockItem
                        type={'checkbox'}
                        item_name={'Статус задач'}
                        item_values={taskStates} />
                    <ModalBlockItem
                        type={'date'}
                        item_name={'Сроки задач'}
                        item_values={[
                            'Начало периода',
                            'Конец периода'
                        ]} />
                    <ModalBlockItem
                        type={'list'}
                        item_name={'Исполнители'}
                        item_values={[props.event_users]} />
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
