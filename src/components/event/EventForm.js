import {
    Stack, Typography, TextField,
    Grid, FormControlLabel, Checkbox
} from '@mui/material'
import React, { useCallback } from 'react'

import useButton from '../../hooks/useButton'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useError from '../../hooks/useError'
import useApi from '../../hooks/useApi'
import { host, backendEndpoints, routes } from '../routes'
import { useNavigate } from 'react-router-dom'
import { prepareDatetime } from '../../utils'
import useColors from '../../hooks/useColors'

export default function EventForm(props) {
    const nameValidation = useValidation(
        props.event_data !== null ? props.event_data.name : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )
    const placeValidation = useValidation(
        props.event_data !== null ? props.event_data.place : '',
        /^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/
    )
    const errorMessage = useError()
    const isOnline = useValidation(props.event_data !== null ? props.event_data.is_online : false, null)
    const eventTypes = [
        {
            value: 'С индивидуальным участием',
            id: 1
        },
        {
            value: 'Командное участие',
            id: 2
        }
    ]
    const eventType = useValidation(
        props.event_data !== null ?
            eventTypes.filter(type => type.value == props.event_data.event_type)[0].value
            :
            eventTypes[0].value
    )

    const getButton = useButton(false)

    const getColors = useColors()
    const saveButtonColors = getColors(saveButton)

    const callApi = useApi()
    const navigate = useNavigate()

    const saveButtonHandler = useCallback(() => {
        const bodyData = props.is_edit ? {} : new FormData()
        document.querySelector('.Event-form').querySelectorAll('input, select, textarea').forEach(input => {
            let formValue = input.value

            if (input.id.includes('datetime')) {
                let timestamp = (new Date(input.value).getTime() / 1000).toString()
                if (timestamp != 'NaN' && timestamp != '') {
                    formValue = timestamp
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
                        window.location.reload()
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
        saveButton,
        () => saveButtonHandler(),
        () => !(placeValidation.validate() && nameValidation.validate())
    )

    const selectLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Тип мероприятия
    </Typography>

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Онлайн мероприятие
    </Typography>

    const datetimeStartLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата начала
    </Typography>

    const datetimeEndLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Дата окончания
    </Typography>

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

    return (
        <Grid className="Event-form" direction="column" container>
            <Grid direction="column" spacing={3} item container>
                <Grid item>
                    <Typography variant="body1" display="flex" color='secondary'
                        gutterBottom marginRight="auto!important"
                        textAlign='start' fontWeight="bold">
                        {
                            props.is_edit?
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
                            <Stack direction="row" spacing={2}>
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
                                        <option key={eventType.id} value={eventType.value}>
                                            {eventType.value}
                                        </option>
                                    ))}
                                </TextField>
                                <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                                    control={<Checkbox id="is_online"
                                        onChange={() => isOnline.set(!isOnline.get())}
                                        checked={isOnline.get()}
                                        sx={{
                                            color: saveButtonColors.backgroundColor,
                                            "&.Mui-checked": {
                                                color: saveButtonColors[':hover'].backgroundColor,
                                            }
                                        }} />}
                                    label={checkboxLabel} />
                            </Stack>
                            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                                <TextField id="datetime_start" required
                                    defaultValue={props.event_data !== null ?
                                        prepareDatetime(props.event_data.datetime_start, true) : ''}
                                    type="datetime-local"
                                    helperText={datetimeStartLabel} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="datetime_end"
                                    defaultValue={props.event_data !== null ?
                                        props.event_data.datetime_end !== null ?
                                            prepareDatetime(props.event_data.datetime_end, true) : '' : ''}
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
