import React from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { prepareDatetime } from '../../utils'

export default function EventShortInfo(props) {
    const { name, place, datetime_start, datetime_end,
        is_complete, users } = props.data.event_info
    const { user } = props.data.user

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                display="block" sx={{ fontWeight: 'bold' }}>
                {name}
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.9em">
                {place}
            </Typography>
            <Typography variant="subtitle1" color="secondary"
                marginRight="auto!important" fontSize="0.8em"
                display="block" sx={{ marginTop: 20 }}>
                {
                    datetime_end !== null ?
                        `Мероприятие пройдет с ${prepareDatetime(datetime_start)} по ${prepareDatetime(datetime_end)}`
                        :
                        `Мероприятие начнется ${prepareDatetime(datetime_start)}`
                }
            </Typography>
            {
                is_complete || users.length != 0 ?
                    <Stack direction="row" spacing={3} marginLeft="auto!important" paddingTop="40px"
                        justifyContent="center" alignItems="center">
                        <Stack direction="row" spacing={3} marginLeft="auto!important"
                            justifyContent="center" alignItems="center">
                            {
                                users.filter(eventUser => eventUser.user.id === user.id
                                    && eventUser.is_organizer).length != 0 ?
                                    <Typography variant="caption" marginLeft="auto!important"
                                        color="secondary" display="block">
                                        Вы создали это мероприятие
                                    </Typography>
                                    :
                                    <Typography variant="caption" marginLeft="auto!important"
                                        color="secondary" display="block">
                                        Вы вступили по коду приглашения
                                    </Typography>
                            }
                        </Stack>
                        {
                            is_complete ?
                                <CheckCircleIcon color="success" />
                                :
                                null
                        }
                    </Stack>
                    :
                    null
            }
        </Stack>
    )
}
