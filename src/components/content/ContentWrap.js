import { Container, useTheme } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {v4 as uuidV4} from "uuid"
import ContentList from './ContentList'
import Footer from '../footer/Footer'
import Toolbar from '../toolbar/Toolbar'
import NotFound from '../notFound/NotFound'
import ContentListItem from './ContentListItem'
import EventShortInfo from '../event/EventShortInfo'
import ListItemButtons from './ListItemButtons'
import { createTool, joinTool, showCompletedEventsTool, profileTool, addTool } from '../toolbar/tools'
import {readMoreButton, editButton, deleteButton} from '../buttons'
import { routes } from '../routes'
import EventForm from '../event/EventForm'

export default function ContentWrap() {
    const theme = useTheme()
    const listData = useSelector(state => state.data)
    const userData = useSelector(state => state.user)
    const location = useLocation()

    const tools = [
        profileTool
    ]
    if (!userData.is_superuser) {
        tools.unshift([joinTool, showCompletedEventsTool])
        if (userData.is_staff) {
            tools.unshift([createTool])
        }
    }
    else {
        tools.unshift([addTool])
    }

    const eventsCaption = userData.is_staff?
        'Создайте новое мероприятие или присоединитесь к существующему'
        :
        userData.is_superuser?
        'Добавьте шаблоны документов согласно СТО вашей организации'
        :
        'Присоединитесь к мероприятию по коду приглашения, который вам выслали организаторы мероприятия'

    return (
        <Container maxWidth={false} disableGutters sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '100vh'
        }}>
            <Toolbar tools={tools} />
            <Container maxWidth="lg" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: listData.length != 0 || location.pathname === routes.create_event? 
                    theme.palette.info.main : theme.palette.primary.main,
                borderRadius: 10,
                width: '100%',
                padding: '20px 0',
                margin: 'auto'
            }}>
                {
                    listData.length != 0?
                    <ContentList data={listData.map(listItem => {
                        const buttons = [readMoreButton]
                        if (listItem.is_complete) {
                            if (listItem.organizer.id == userData.id) {
                                buttons.push(deleteButton)
                            }
                        }
                        else {
                            buttons.push(editButton)
                        }
                            
                        const itemData = {
                            item_info: <EventShortInfo data={listItem} />,
                            item_buttons: <ListItemButtons buttons={buttons} />
                        }
                        return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                        })} />
                    :
                    location.pathname === routes.create_event?
                    <EventForm data={null} />
                    :
                    <NotFound additional_caption={eventsCaption} />
                }
            </Container>
            <Footer />
        </Container>
    )
}
