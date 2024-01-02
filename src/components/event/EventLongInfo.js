import React, { useCallback } from 'react'
import { Stack } from '@mui/material'

import { prepareDatetime } from '../../utils'
import ModalBlockItem from '../modal/ModalBlockItem'

export default function EventLongInfo(props) {
    const { place, datetime_start, datetime_end, users, docs,
        is_complete, description, is_online, event_type } = props.data.event_info
    const { user } = props.data.user

    const getAdditionalData = useCallback(() => {
        const isOrganizer = users.filter(eventUser => {
            return eventUser.user.id === user.id
                && eventUser.is_organizer
        }).length != 0
        const eventOrganizer = users.filter(eventUser => eventUser.is_organizer)[0]

        const additionalData = [
            isOrganizer? 'Вы создатель мероприятия' : 
                `Создатель мероприятия - ${eventOrganizer.user.name}`,
            `Количество участников организационного комитета: ${users.length}`,
            `Количество документов: ${docs.length}`,
            is_online ? 'Online-мероприятие' : 'Очное мероприятие',
        ]

        if (is_complete) {
            additionalData.push('Мероприятие завершено')
        }

        return additionalData
    }, [is_online, docs, users, user, is_complete])

    return (
        <Stack spacing={2} overflow="auto" maxHeight="600px"
            justifyContent="flex-start" alignItems="center">
            {
                place !== null ?
                    <ModalBlockItem item_name={'Место проведения'} item_values={[place]} />
                    :
                    null
            }
            <ModalBlockItem item_name={'Дата и время начала'}
                item_values={[prepareDatetime(datetime_start)]} />
            {
                datetime_end !== null ?
                    <ModalBlockItem item_name={'Дата и время окончания'}
                        item_values={[prepareDatetime(datetime_end)]} />
                    :
                    null
            }
            {
                description !== null ?
                    <ModalBlockItem item_name={'Описание'}
                        item_values={[description]} />
                    :
                    null
            }
            <ModalBlockItem item_name={'Тип мероприятия'} item_values={[event_type]} />
            <ModalBlockItem item_name={'Дополнительно'} item_values={getAdditionalData()} />
        </Stack>
    )
}
