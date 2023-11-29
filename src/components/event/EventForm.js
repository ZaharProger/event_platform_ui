import {
    Stack, Typography, Button, TextField,
    Grid, FormControlLabel, Checkbox
} from '@mui/material'
import React, { useState } from 'react'

import useButton from '../../hooks/useButton'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'

export default function EventForm(props) {
    const validateName = useValidation(/^[\w\d\s@~`"'/\\!#$%^&*()\[\]{}\-_+=:;><.,№]+$/)
    const [name, setName] = useState(props.data !== null ? props.data.event.name : '')

    const [isOnline, setIsOnline] = useState(props.data !== null ? props.data.event.is_online : false)

    const [errorResponse, setErrorResponse] = useState(null)
    const getSaveButtonColors = useButton()
    const saveButtonColors = getSaveButtonColors(saveButton)

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
                        <Stack direction="column" spacing={2}>
                            <TextField id="name" required
                                onInput={(event) => setName(event.target.value)}
                                defaultValue={props.data !== null ? props.data.event.name : ''}
                                fullWidth label="Название" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="place" fullWidth
                                defaultValue={props.data !== null ? props.data.event.place : ''}
                                label="Место проведения" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                        </Stack>
                    </Grid>
                    <Grid item width="600px">
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    id="event_type"
                                    select
                                    label={<Typography variant="subtitle2"
                                        fontSize="0.8em" color="secondary">
                                        Тип мероприятия
                                    </Typography>}
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
                                    label={<Typography variant="subtitle2"
                                        fontSize="0.8em" color="secondary">
                                        Онлайн мероприятие
                                    </Typography>} />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <TextField id="datetime_start" required
                                    onInput={(event) => setName(event.target.value)}
                                    defaultValue={''} type="datetime-local"
                                    fullWidth helperText="Дата и время начала" variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
                                <TextField id="datetime_end" fullWidth
                                    defaultValue={''} type="datetime-local"
                                    helperText="Дата и время окончания" variant="outlined"
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
