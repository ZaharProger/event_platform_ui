import React from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { prepareDatetime } from '../../utils'

export default function EventLongInfo(props) {
    const { place, datetime_start, datetime_end, users,
        is_complete, description, is_online, event_type } = props.data.event_info
    const { user } = props.data.user

    const isOrganizer = users.filter(eventUser => {
        return eventUser.user.id === user.id
            && eventUser.is_organizer
    }).length != 0

    const eventOrganizer = users.filter(eventUser => {
        return eventUser.is_organizer
    })[0]

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center">
            {
                place !== null ?
                    <Typography variant="subtitle1" marginRight="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        {
                            <>
                                <span style={{ fontWeight: 'bold' }}>Место проведения</span>
                                {`: ${place}`}
                            </>
                        }
                    </Typography>
                    :
                    null
            }
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    <>
                        <span style={{ fontWeight: 'bold' }}>Дата и время начала</span>
                        {`: ${prepareDatetime(datetime_start)}`}
                    </>
                }
            </Typography>
            {
                datetime_end !== null ?
                    <Typography variant="subtitle1" marginRight="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        {
                            <>
                                <span style={{ fontWeight: 'bold' }}>Дата и время окончания</span>
                                {`: ${prepareDatetime(datetime_end)}`}
                            </>
                        }
                    </Typography>
                    :
                    null
            }
            {
                description !== null ?
                    <Typography variant="subtitle1" marginRight="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        {
                            <>
                                <span style={{ fontWeight: 'bold' }}>Описание</span>
                                {`: ${description}`}
                            </>
                        }
                    </Typography>
                    :
                    null
            }
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    <>
                        <span style={{ fontWeight: 'bold' }}>Тип мероприятия</span>
                        {`: ${event_type}`}
                    </>
                }
            </Typography>
            <Typography variant="caption" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    isOrganizer ?
                        'Вы создатель мероприятия'
                        :
                        <>
                            <span style={{ fontWeight: 'bold' }}>Создатель мероприятия</span>
                            {`: ${eventOrganizer.user.name}`}
                        </>
                }
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    `Количество участников организационного комитета: ${users.length}`
                }
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {is_online ? 'Online-мероприятие' : 'Очное мероприятие'}
            </Typography>
            {
                is_complete ?
                    <Stack spacing={1} marginRight="auto!important" alignItems="center" direction="row">
                        <Typography variant="subtitle1" marginRight="auto!important"
                            color="secondary" display="block" fontSize="0.8em">
                            Мероприятие завершено
                        </Typography>
                        <CheckCircleIcon color="success" />
                    </Stack>
                    :
                    null
            }
        </Stack>
    )
}
