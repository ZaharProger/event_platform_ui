import { Container, useTheme } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import {v4 as uuidV4} from "uuid"
import ContentListItem from './ContentListItem'
import EventShortInfo from '../event/EventShortInfo'
import ListItemButtons from './ListItemButtons'
import {readMoreButton, editButton, deleteButton} from './buttons'

export default function ContentList() {
    const theme = useTheme()
    const listData = useSelector(state => state.data)

    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.info,
            borderRadius: 10,
            padding: '20 0'
        }}>
            {
                listData.map(listItem => {
                    const buttons = [readMoreButton]
                    buttons.push(listItem.is_complete? deleteButton : editButton)
                    
                    const itemData = {
                        item_info: <EventShortInfo data={listItem} />,
                        item_buttons: <ListItemButtons buttons={buttons} />
                    }
                    return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                })
            }
        </Container>
    )
}
