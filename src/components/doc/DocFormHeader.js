import { AppBar, Stack, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { useCallback } from 'react'

import useButton from '../../hooks/useButton'
import useValidation from '../../hooks/useValidation'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { saveButton, addButton, filterButton } from '../buttons'
import { useSelector } from 'react-redux'

export default function DocFormHeader(props) {
    const theme = useTheme()

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const isNearMobile = useMediaQuery('(max-width: 1300px)')

    const nameValidation = useValidation(
        props.doc_data !== null ? props.doc_data.name : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )

    const getButton = useButton(false)
    const textFieldStyles = useTextFieldStyles('outlined')

    const assignation = useSelector(state => state.assignation_list)
    const syncData = useCallback((dataToSync) => {
        let newData = []

        if (props.is_roadmap) {
            newData = dataToSync.map(itemToSync => {
                let itemUsers = [...itemToSync.users]
                const foundAssignation = assignation.filter(item => item.id == itemToSync.id)

                if (foundAssignation.length != 0) {
                    if (foundAssignation[0].users !== itemUsers) {
                        itemUsers = foundAssignation[0].users
                    }
                }

                return {
                    ...itemToSync,
                    users: itemUsers,
                }
            })
        }

        return newData
    }, [props.is_roadmap, assignation])

    const buttons = []
    if (props.doc_data.is_table || props.user.is_staff) {
        if (props.user.is_staff) {
            buttons.push(
                getButton(
                    saveButton, 
                    () => props.save_callback((dataToSync) => syncData(dataToSync)), 
                    () => !nameValidation.validate()
                )
            )
        }
        if (props.doc_data.is_table) {
            buttons.push(
                getButton(
                    addButton, 
                    () => props.additional_callback((dataToSync) => syncData(dataToSync))
                ),
                getButton(filterButton, () => props.filter_callback())
            )
        }
    }

    const prevTrigger = useSelector(state => state.trigger)

    const docHeaderStyles = {
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: !prevTrigger? 'transparent' : theme.palette.primary.main,
    }
    if (!prevTrigger) {
        docHeaderStyles.boxShadow = 'none'
    }

    return (
        <AppBar position="sticky" sx={docHeaderStyles} id="Doc-form-header">
            <Stack spacing={2} direction={isMobile ? 'column' : 'row'} width="100%"
                justifyContent="center" alignItems="center">
                <TextField id="name" required fullWidth={!isNearMobile}
                    onInput={(event) => nameValidation.set(event.target.value)}
                    defaultValue={props.doc_data !== null ? props.doc_data.name : ''}
                    label="Название" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
                <Stack spacing={1} direction="row" 
                    justifyContent="center" alignItems="center">
                    {
                        buttons
                    }
                </Stack>
            </Stack>
        </AppBar>
    )
}
