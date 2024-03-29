import { Stack, TextField, useMediaQuery } from '@mui/material'
import React, { useCallback } from 'react'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import useButton from '../../hooks/useButton'
import useValidation from '../../hooks/useValidation'
import { saveButton } from '../buttons'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host, routes } from '../routes'
import useRoute from '../../hooks/useRoute'

export default function GroupForm(props) {
    const isMobile = useMediaQuery('(max-width: 1000px)')
    const isNearMobile = useMediaQuery('(max-width: 1300px)')

    const callApi = useApi()

    const nameValidation = useValidation(
        props.group_info !== null ? props.group_info.name : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )

    const getButton = useButton(false)
    const textFieldStyles = useTextFieldStyles('outlined')

    const navigate = useRoute()

    const saveButtonHandler = useCallback(() => {
        const requestData = {
            old_name: props.group_info.name,
            name: nameValidation.get()
        }

        callApi(`${host}${backendEndpoints.user_groups}`, 'PUT', JSON.stringify(requestData), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                navigate(routes.admin_group)
            }
        })
    }, [nameValidation, props])

    return (
        <Stack spacing={2} direction={isMobile ? 'column' : 'row'} width="100%"
            justifyContent="center" alignItems="center">
            <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap"
                justifyContent="center" alignItems="center">
                <TextField id="name" required fullWidth={!isNearMobile}
                    onInput={(event) => nameValidation.set(event.target.value)}
                    defaultValue={props.group_info !== null ? props.group_info.name : ''}
                    label="Наименование группы" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
            </Stack>
            <Stack spacing={1} direction="row"
                justifyContent="center" alignItems="center">
                {
                    getButton(
                        saveButton,
                        () => saveButtonHandler(),
                        () => !nameValidation.validate(),
                        {}
                    )
                }
            </Stack>
        </Stack>
    )
}
