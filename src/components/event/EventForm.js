import { Stack, Typography } from '@mui/material'
import React from 'react'

export default function EventForm(props) {
    return (
        <Grid direction="row" container>
            <Grid direction="column" spacing={3} item container>
                <Grid item>
                    <Typography variant="body1" display="flex" color='secondary'
                        gutterBottom marginRight="auto!important"
                        textAlign='start' fontWeight="bold">
                        Настройки
                    </Typography>
                </Grid>
                <Grid direction="row" md spacing={3} item container>
                    <Grid item marginTop="40px" width="400px">
                        <Stack direction="column" spacing={2}>
                            <TextField id="name" required
                                onInput={(event) => setName(event.target.value)}
                                defaultValue={props.data !== null ? props.data.user.name : ''}
                                fullWidth label="ФИО" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="email" fullWidth required
                                onInput={(event) => setEmail(event.target.value)}
                                defaultValue={props.data !== null ? props.data.user.email : ''}
                                label="E-mail" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                        </Stack>
                    </Grid>
                    <Grid item width="500px">
                        <Stack direction="column" spacing={2}>
                            <TextField id="phone" label="Номер телефона" variant="outlined"
                                defaultValue={props.data !== null ? props.data.user.phone : ''}
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="telegram" label="Аккаунт Telegram" variant="outlined"
                                defaultValue={props.data !== null ? props.data.user.telegram : ''}
                                color="secondary" sx={{ ...textFieldStyles }} />
                            <TextField id="organization" fullWidth
                                defaultValue={props.data !== null ? props.data.user.organization : ''}
                                label="Организация" variant="outlined"
                                color="secondary" sx={{ ...textFieldStyles }} />
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant="contained"
                        disabled={!(validateName(name) && validateEmail(email))}
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
