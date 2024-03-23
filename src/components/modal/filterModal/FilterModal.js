import React from 'react'

import {
    Dialog, DialogTitle, Stack,
    DialogContent, DialogActions, useTheme
} from '@mui/material'
import useButton from '../../../hooks/useButton'
import { applyButton, cancelButton, closeButton } from '../../buttons'
import ModalBlockItem from '../ModalBlockItem'
import { useDispatch, useSelector } from 'react-redux'
import { changeFilterStates, changeFilterUsers } from '../../../redux/actions'

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
        value: 'Скоро дедлайн',
        color: 'error'
    })

    const dispatch = useDispatch()

    const filterUsers = useSelector(state => state.filter_users)
    const filterStates = useSelector(state => state.filter_states)

    const getButton = useButton(false)
    const buttons = [
        getButton(closeButton, () => props.close_callback()),
        getButton(cancelButton, () => {
            dispatch(changeFilterStates(Array()))
            dispatch(changeFilterUsers(Array()))
        }),
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
                        type={'list'}
                        item_name={'Исполнители'}
                        item_values={[props.filter_values]} />
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
