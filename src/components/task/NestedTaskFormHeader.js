import { AppBar, Stack, useTheme } from '@mui/material'
import React from 'react'

import useButton from '../../hooks/useButton'
import { addButton, filterButton, sortButton } from '../buttons'
import { useSelector, useDispatch } from 'react-redux'
import useSync from '../../hooks/useSync'
import { backTool } from '../toolbar/tools'
import { changeNestedTask } from '../../redux/actions'

export default function NestedTaskFormHeader(props) {
    const theme = useTheme()
    const getButton = useButton(false)
    const getTool = useButton(true)

    const syncFunction = useSync()
    const dispatch = useDispatch()

    const buttons = [
        getTool(
            backTool, 
            () => {
                props.close_callback((isRoadmap, dataToSync, currentData) => {
                    return syncFunction(isRoadmap, dataToSync, currentData)
                })
                dispatch(changeNestedTask(null))
            }
        )
    ]
    if (props.user.is_staff) {
        buttons.push(
            getButton(
                addButton,
                () => props.additional_callback((isRoadmap, dataToSync, currentData) => {
                    return syncFunction(isRoadmap, dataToSync, currentData)
                })
            )
        )
    }
    buttons.push(
        getButton(filterButton, () => props.filter_callback(
            (isRoadmap, dataToSync, currentData) => {
                return syncFunction(isRoadmap, dataToSync, currentData)
            }
        )),
        getButton(sortButton, () => props.sort_callback(
            (isRoadmap, dataToSync, currentData) => {
                return syncFunction(isRoadmap, dataToSync, currentData)
            }
        ))
    )

    const prevTrigger = useSelector(state => state.trigger)

    const docHeaderStyles = {
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: !prevTrigger ? 'transparent' : theme.palette.primary.main,
    }
    if (!prevTrigger) {
        docHeaderStyles.boxShadow = 'none'
    }

    return (
        <AppBar position="sticky" sx={docHeaderStyles} id="Doc-form-header">
            <Stack spacing={1} direction="row"
                justifyContent="center" alignItems="center">
                {
                    buttons
                }
            </Stack>
        </AppBar>
    )
}
