import React from 'react'
import { Stack, Typography } from '@mui/material'

export default function EventUserInfo(props) {
    const { is_organizer, user: { name, email } } = props.user

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center" width="100%">
            <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                display="block" fontWeight="bold">
                {name}
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.9em">
                {email}
            </Typography>
            {
                is_organizer ?
                    <Typography variant="subtitle1" marginRight="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        Создатель мероприятия
                    </Typography>
                    :
                    null
            }
        </Stack>
    )
}
