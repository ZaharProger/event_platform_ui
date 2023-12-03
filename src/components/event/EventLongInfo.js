import React from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { prepareDatetime } from '../../utils'

export default function EventLongInfo(props) {
    const { name, place, datetime_start, datetime_end, users,
        is_complete, description, is_online, event_type, secret_code } = props.data.event_info[0]
    const { user } = props.data.user

    const isOrganizer = users.filter(eventUser => {
        return eventUser.user.id === user.id
            && eventUser.is_organizer
    }).length != 0

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                display="block" sx={{ fontWeight: 'bold' }}>
                {name}
            </Typography>
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
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {is_online ? 'Online-мероприятие' : 'Очное мероприятие'}
            </Typography>
            {
                is_complete ?
                    <Stack spacing={2} marginRight="auto!important" alignItems="center">
                        <CheckCircleIcon color="success" />
                        <Typography variant="subtitle1" marginRight="auto!important"
                            color="secondary" display="block" fontSize="0.8em">
                            Мероприятие завершено
                        </Typography>
                    </Stack>
                    :
                    null
            }
            <Typography variant="caption" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    isOrganizer? 'Вы создали это мероприятие' : 'Вы вступили по коду приглашения'
                }
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.8em">
                {
                    `Количество участников организационного комитета: ${users.length}`
                }
            </Typography>
            {
                isOrganizer ?
                    <Typography variant="subtitle1" marginRight="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        {
                            `Секретный код приглашения: ${secret_code}`
                        }
                    </Typography>
                    :
                    null
            }
        </Stack>
    )
}
