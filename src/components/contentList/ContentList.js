import { Container, useTheme } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import {v4 as uuidV4} from "uuid"
import ContentListItem from './ContentListItem'
import EventShortInfo from '../event/EventShortInfo'
import ListItemButtons from './ListItemButtons'
import NotFound from '../notFound/NotFound'
import {readMoreButton, editButton, deleteButton} from '../buttons'

export default function ContentList() {
    const theme = useTheme()
    const listData = useSelector(state => state.data)

    const eventsCaption = 'Создайте новое мероприятие или присоединитесь к существующему'

    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: listData.length != 0? theme.palette.info.main : theme.palette.primary.main,
            borderRadius: 10,
            width: '100%',
            padding: '20px 0',
            margin: 'auto'
        }}>
            {
                listData.length != 0?
                listData.map(listItem => {
                    const buttons = [readMoreButton]
                    buttons.push(listItem.is_complete? deleteButton : editButton)
                    
                    const itemData = {
                        item_info: <EventShortInfo data={listItem} />,
                        item_buttons: <ListItemButtons buttons={buttons} />
                    }
                    return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                })
                :
                <NotFound additional_caption={eventsCaption} />
            }
        </Container>
    )
}
