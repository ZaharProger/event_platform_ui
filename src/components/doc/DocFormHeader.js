import { AppBar, Stack, TextField, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import useValidation from '../../hooks/useValidation'
import { saveButton, addButton, filterButton } from '../buttons'
import { useSelector } from 'react-redux'

export default function DocFormHeader(props) {
    const isMobile = useMediaQuery('(max-width: 1000px)')

    const nameValidation = useValidation(
        props.doc_data !== null ? props.doc_data.name : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )

    const getButton = useButton(false)
    const getColors = useColors()
    const saveButtonColors = getColors(saveButton)

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: saveButtonColors.color,
            '& fieldset': {
                borderColor: saveButtonColors.backgroundColor,
            },
            '&:hover fieldset': {
                borderColor: saveButtonColors.backgroundColor,
            },
            '&.Mui-focused fieldset': {
                borderColor: saveButtonColors[':hover'].backgroundColor,
            },
        }
    }

    const buttons = [
        getButton(saveButton, () => props.save_callback(), () => !nameValidation.validate())
    ]
    if (props.doc_data.is_table || props.user.is_staff) {
        if (props.user.is_staff) {
            buttons.push(
                getButton(addButton, () => props.additional_callback())
            )
        }
        if (props.doc_data.is_table) {
            buttons.push(
                getButton(filterButton, (event) => console.log(1))
            )
        }
    }

    const prevTrigger = useSelector(state => state.trigger)

    const docHeaderStyles = {
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: !prevTrigger? 'transparent' : saveButtonColors.color,
    }
    if (!prevTrigger) {
        docHeaderStyles.boxShadow = 'none'
    }

    return (
        <AppBar position="sticky" sx={docHeaderStyles}>
            <Stack spacing={2} direction={isMobile ? 'column' : 'row'} width="100%"
                justifyContent="space-between" alignItems="center">
                <TextField id="name" required autoFocus
                    onInput={(event) => nameValidation.set(event.target.value)}
                    defaultValue={props.doc_data !== null ? props.doc_data.name : ''}
                    fullWidth label="Название" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
                <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                    {
                        buttons
                    }
                </Stack>
            </Stack>
        </AppBar>
    )
}