import {
    Stack, Typography, TextField,
    Grid, FormControlLabel, Checkbox, useTheme
} from '@mui/material'
import React, { useCallback } from 'react'

import useButton from '../../hooks/useButton'
import { createButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useError from '../../hooks/useError'
import useApi from '../../hooks/useApi'
import { host, backendEndpoints, routes } from '../routes'
import { prepareDatetime } from '../../utils'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import useRoute from '../../hooks/useRoute'

export default function EventForm(props) {
    const theme = useTheme()

    const nameValidation = useValidation(
        props.event_data !== null ? props.event_data.name : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )
    const placeValidation = useValidation(
        props.event_data !== null ? props.event_data.place : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )
    const eventFormValidation = useValidation(
        props.event_data !== null ? props.event_data.event_form : '',
        /^[a-zA-Zа-яА-Я\d\s]+$/
    )

    const errorMessage = useError()
    const isOnline = useValidation(props.event_data !== null ?
        props.event_data.is_online : false, null)
    const forStudents = useValidation(props.event_data !== null ?
        props.event_data.for_students : false, null)

    const eventTypes = localStorage.getItem('event_types') !== null ?
        JSON.parse(localStorage.getItem('event_types')) : [{ label: '', value: '' }]
    const eventType = useValidation(
        props.event_data !== null ?
            eventTypes.filter(type => type.value == props.event_data.event_type)[0].value
            :
            eventTypes[0].value
    )
    const eventLevels = localStorage.getItem('event_levels') !== null ?
        JSON.parse(localStorage.getItem('event_levels')) : [{ label: '', value: '' }]
    const eventLevel = useValidation(
        props.event_data !== null ?
            eventLevels.filter(level => level.value == props.event_data.event_level)[0].value
            :
            eventLevels[0].value
    )
    const eventCharacters = localStorage.getItem('event_characters') !== null ?
        JSON.parse(localStorage.getItem('event_characters')) : [{ label: '', value: '' }]
    const eventCharacter = useValidation(
        props.event_data !== null ?
            eventCharacters.filter(character => character.value == props.event_data.event_character)[0].value
            :
            eventCharacters[0].value
    )

    const getButton = useButton(false)

    const callApi = useApi()
    const navigate = useRoute()

    const createButtonHandler = useCallback(() => {
        const bodyData = props.is_edit ? {} : new FormData()
        document.querySelector('.Event-form')
            .querySelectorAll('input, select, textarea')
            .forEach(input => {
                let formValue = input.value

                if (input.type.includes('datetime')) {
                    let timestamp = new Date(input.value).getTime() / 1000
                    if (!isNaN(timestamp) && timestamp !== '') {
                        formValue = timestamp
                    }
                    else {
                        formValue = null
                    }
                }
                if (props.is_edit) {
                    bodyData[input.id] = formValue
                }
                else {
                    bodyData.set(input.id, formValue)
                }
            })

        const checkboxValue = document.querySelector('#is_online').checked
        if (props.is_edit) {
            bodyData['id'] = props.event_data.id
            bodyData['is_online'] = checkboxValue
        }
        else {
            bodyData.set('is_online', checkboxValue)
        }

        const method = props.is_edit ? 'PUT' : 'POST'
        const requestData = props.is_edit ? JSON.stringify(bodyData) : bodyData
        const headers = props.is_edit ? { 'Content-Type': 'application/json' } : null

        callApi(`${host}${backendEndpoints.events}`, method, requestData, headers)
            .then(responseData => {
                if (responseData.status == 200) {
                    errorMessage.set(null)
                    if (props.is_edit) {
                        navigate(null)
                    }
                    else {
                        navigate(`${routes.event_card}${responseData.data.data.id}`)
                    }
                }
                else {
                    errorMessage.set(responseData.data.message)
                }
            })
    }, [])

    const button = getButton(
        createButton,
        () => createButtonHandler(),
        () => !(placeValidation.validate() && nameValidation.validate() && eventFormValidation.validate())
    )

    const selectLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Тип мероприятия
    </Typography>

    const isOnlineCheckboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Онлайн мероприятие
    </Typography>
    const forStudentsCheckboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Для студентов
    </Typography>

    const datetimeStartLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата начала
    </Typography>

    const datetimeEndLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата окончания
    </Typography>

    const textFieldStyles = useTextFieldStyles('outlined')

    return (
        <Grid className="Event-form" direction="column" container>
            <Grid direction="column" spacing={3} item container>
                <Grid item>
                    <Typography variant="body1" display="flex" color='secondary'
                        gutterBottom marginRight="auto!important"
                        textAlign='start' fontWeight="bold">
                        {
                            props.is_edit ?
                                'Информация о мероприятии'
                                :
                                'Новое мероприятие'
                        }
                    </Typography>
                </Grid>
                <Grid direction="row" md spacing={3} item container>
                    <Grid item width="500px">
                        <Stack direction="column" spacing={2} useFlexGap flexWrap="wrap">
                            <TextField id="name" required autoFocus
                                onInput={(event) => nameValidation.set(event.target.value)}
                                defaultValue={props.event_data !== null ? props.event_data.name : ''}
                                fullWidth label="Название" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="event_form" fullWidth required
                                onInput={(event) => eventFormValidation.set(event.target.value)}
                                defaultValue={props.event_data !== null ? props.event_data.event_form : ''}
                                label="Форма мероприятия" variant="outlined"
                                multiline rows={7} color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="place" fullWidth required
                                onInput={(event) => placeValidation.set(event.target.value)}
                                defaultValue={props.event_data !== null ? props.event_data.place : ''}
                                label="Место проведения" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="description" fullWidth
                                defaultValue={props.event_data !== null ? props.event_data.description : ''}
                                label="Описание" variant="outlined"
                                multiline rows={7} color="secondary" sx={{ ...textFieldStyles }} />
                        </Stack>
                    </Grid>
                    <Grid item width="600px">
                        <Stack direction="column" spacing={2} useFlexGap flexWrap="wrap">
                            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                                <TextField
                                    id="event_level"
                                    select
                                    label={selectLabel}
                                    sx={{ ...textFieldStyles }}
                                    onChange={(event) => eventLevel.set(event.target.value)}
                                    defaultValue={eventLevel.get()}
                                    SelectProps={{
                                        native: true,
                                    }}>
                                    {eventLevels.map((eventLevel) => (
                                        <option key={eventLevel.label} value={eventLevel.value}>
                                            {eventLevel.value}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField
                                    id="event_character"
                                    select
                                    label={selectLabel}
                                    sx={{ ...textFieldStyles }}
                                    onChange={(event) => eventCharacter.set(event.target.value)}
                                    defaultValue={eventCharacter.get()}
                                    SelectProps={{
                                        native: true,
                                    }}>
                                    {eventCharacters.map((eventCharacter) => (
                                        <option key={eventCharacter.label} value={eventCharacter.value}>
                                            {eventCharacter.value}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField
                                    id="event_type"
                                    select
                                    label={selectLabel}
                                    sx={{ ...textFieldStyles }}
                                    onChange={(event) => eventType.set(event.target.value)}
                                    defaultValue={eventType.get()}
                                    SelectProps={{
                                        native: true,
                                    }}>
                                    {eventTypes.map((eventType) => (
                                        <option key={eventType.label} value={eventType.value}>
                                            {eventType.value}
                                        </option>
                                    ))}
                                </TextField>
                                <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                                    control={<Checkbox id="is_online"
                                        onChange={() => isOnline.set(!isOnline.get())}
                                        checked={isOnline.get()}
                                        sx={{
                                            color: theme.palette.secondary.main,
                                            "&.Mui-checked": {
                                                color: theme.palette.action.main,
                                            }
                                        }} />}
                                    label={isOnlineCheckboxLabel} />
                                <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                                    control={<Checkbox id="for_students"
                                        onChange={() => forStudents.set(!forStudents.get())}
                                        checked={forStudents.get()}
                                        sx={{
                                            color: theme.palette.secondary.main,
                                            "&.Mui-checked": {
                                                color: theme.palette.action.main,
                                            }
                                        }} />}
                                    label={forStudentsCheckboxLabel} />
                            </Stack>
                            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                                <TextField id="datetime_start"
                                    defaultValue={props.event_data !== null ?
                                        prepareDatetime(props.event_data.datetime_start, true)
                                        :
                                        prepareDatetime(null, true)
                                    }
                                    type="datetime-local"
                                    helperText={datetimeStartLabel} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="datetime_end"
                                    defaultValue={props.event_data !== null ?
                                        props.event_data.datetime_end !== null ?
                                            prepareDatetime(props.event_data.datetime_end, true)
                                            :
                                            ''
                                        :
                                        ''
                                    }
                                    type="datetime-local"
                                    helperText={datetimeEndLabel} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item>
                    {
                        button
                    }
                </Grid>
                {
                    errorMessage.get() !== null ?
                        <Typography variant="subtitle2" display="block"
                            color="error" textAlign="center">
                            {
                                errorMessage.get()
                            }
                        </Typography>
                        :
                        null
                }
            </Grid>
        </Grid>
    )
}
