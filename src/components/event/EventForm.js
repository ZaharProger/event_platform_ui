import {
    Stack, Typography, Button, TextField,
    Grid, FormControlLabel, Checkbox
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import useButton from '../../hooks/useButton'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useApi from '../../hooks/useApi'
import { host, backendEndpoints, routes } from '../routes'
import { useNavigate } from 'react-router-dom'

export default function EventForm(props) {
    const validateName = useValidation(/^[A-Za-zА-Яа-я\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/)
    const [name, setName] = useState(props.event_data !== null ? props.event_data.name : '')

    const [isOnline, setIsOnline] = useState(props.event_data !== null ? props.event_data.is_online : false)

    const [errorResponse, setErrorResponse] = useState(null)
    const getSaveButtonColors = useButton()
    const saveButtonColors = getSaveButtonColors(saveButton)

    const callApi = useApi()
    const navigate = useNavigate()

    const saveButtonHandler = useCallback(() => {
        const formData = new FormData()
        document.querySelector('.Event-form').querySelectorAll('input, select, textarea').forEach(input => {
            let formValue = input.value

            if (input.id.includes('datetime')) {
                const timestamp = (new Date(input.value).getTime() / 1000).toString()
                if (timestamp !== 'NaN') {
                    formValue = timestamp
                }
            }
            formData.set(input.id, formValue)
        })
        formData.set('is_online', document.querySelector('#is_online').checked? '1' : '0')

        callApi(`${host}${backendEndpoints.events}`, 'POST', formData, null)
            .then(responseData => {
                if (responseData.status == 200) {
                    setErrorResponse(null)
                    navigate(routes.home)
                }
                else {
                    setErrorResponse(responseData.data.message)
                }
            })
    }, [])

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

    return (
        <Grid className="Event-form" direction="column" container>
            <Grid direction="column" spacing={3} item container>
                <Grid item>
                    <Typography variant="body1" display="flex" color='secondary'
                        gutterBottom marginRight="auto!important"
                        textAlign='start' fontWeight="bold">
                        Новое мероприятие
                    </Typography>
                </Grid>
                <Grid direction="row" md spacing={3} item container>
                    <Grid item width="500px">
                        <Stack direction="column" spacing={2} useFlexGap flexWrap="wrap">
                            <TextField id="name" required
                                onInput={(event) => setName(event.target.value)}
                                defaultValue={props.event_data !== null ? props.event_data.name : ''}
                                fullWidth label="Название" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="place" fullWidth
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
                                    defaultValue={eventTypes[0].value}
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
                                        onChange={() => setIsOnline(!isOnline)}
                                        checked={isOnline}
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
                                    defaultValue={''} type="datetime-local"
                                    fullWidth helperText={datetimeStartLabel} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="datetime_end" fullWidth
                                    defaultValue={''} type="datetime-local"
                                    helperText={datetimeEndLabel} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant="contained"
                        disabled={!validateName(name)}
                        disableElevation
                        sx={{
                            fontSize: '0.8em',
                            padding: '8px 50px',
                            transition: '0.3s ease-out',
                            ...saveButtonColors
                        }} onClick={() => saveButtonHandler()}>
                        {
                            saveButton.label
                        }
                    </Button>
                </Grid>
                {
                    errorResponse !== null ?
                        <Typography variant="subtitle2" display="block"
                            color="error" textAlign="center">
                            {
                                errorResponse
                            }
                        </Typography>
                        :
                        null
                }
            </Grid>
        </Grid>
    )
}
