import React from 'react'
import { Stack, Tooltip, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { prepareDatetime } from '../../utils'

export default function EventShortInfo(props) {
    const { name, place, datetime_start, datetime_end,
        is_complete, users } = props.data.event_info
    const { user } = props.data.user

    const isOrganizer = users.filter(eventUser => eventUser.user.id === user.id
        && eventUser.is_organizer).length != 0
    const eventOrganizer = users.filter(eventUser => {
        return eventUser.is_organizer
    })[0]

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center" width="100%">
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
                            <Typography variant="caption" marginLeft="auto!important"
                                color="secondary" display="block">
                                {
                                    isOrganizer ?
                                        'Вы создатель мероприятия'
                                        :
                                        `Создатель мероприятия: ${eventOrganizer.user.name}`
                                }
                            </Typography>
                        </Stack>
                        {
                            is_complete ?
                                <Tooltip title="Мероприятие завершено">
                                    <CheckCircleIcon color="success" />
                                </Tooltip>
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
