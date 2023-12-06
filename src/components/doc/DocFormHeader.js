import { Stack, TextField, useMediaQuery } from '@mui/material'
import React from 'react'

import useButton from '../../hooks/useButton'
import useColors from '../../hooks/useColors'
import useValidation from '../../hooks/useValidation'
import { saveButton, addButton } from '../buttons'

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
    if (props.doc_data.is_table) {
        buttons.push(
            getButton(addButton, () => props.additional_callback())
        )
    }

    return (
        <Stack spacing={2} direction={isMobile? 'column' : 'row'} width="100%"
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
    )
}
