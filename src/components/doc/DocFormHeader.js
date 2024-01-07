import { AppBar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

import useButton from '../../hooks/useButton'
import useValidation from '../../hooks/useValidation'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { saveButton, addButton, filterButton, sortButton } from '../buttons'
import { useSelector } from 'react-redux'
import useSync from '../../hooks/useSync'

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

    const syncFunction = useSync()

    const buttons = []
    if (props.doc_data.is_table || props.user.is_staff) {
        if (props.user.is_staff) {
            buttons.push(
                getButton(
                    saveButton,
                    () => props.save_callback((isRoadmap, dataToSync, currentData) => {
                        return syncFunction(isRoadmap, dataToSync, currentData)
                    }),
                    () => !nameValidation.validate()
                ),
                getButton(
                    addButton,
                    () => props.additional_callback((isRoadmap, dataToSync, currentData) => {
                        return syncFunction(isRoadmap, dataToSync, currentData)
                    })
                )
            )
        }
        if (props.doc_data.is_table) {
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
        }
    }

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
            <Stack spacing={2} direction={isMobile ? 'column' : 'row'} width="100%"
                justifyContent="center" alignItems="center">
                {
                    props.user.is_staff ?
                        <TextField id="name" required fullWidth={!isNearMobile}
                            onInput={(event) => nameValidation.set(event.target.value)}
                            defaultValue={props.doc_data !== null ? props.doc_data.name : ''}
                            label="Название" variant="outlined"
                            color="secondary" sx={{ ...textFieldStyles }} />
                        :
                        <Typography variant="subtitle1" fontWeight="bold"
                            fontSize="1.2em" marginRight={isMobile ? 'center' : 'auto!important'}
                            color="secondary" textAlign="center">
                            {
                                props.doc_data !== null ? props.doc_data.name : ''
                            }
                        </Typography>
                }
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
