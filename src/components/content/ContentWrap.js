import { Container, Drawer, useTheme } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { v4 as uuidV4 } from "uuid"
import ContentList from './ContentList'
import Footer from '../footer/Footer'
import Toolbar from '../toolbar/Toolbar'
import NotFound from '../notFound/NotFound'
import ContentListItem from './ContentListItem'
import EventShortInfo from '../event/EventShortInfo'
import ListItemButtons from './ListItemButtons'
import { createTool, joinTool, showCompletedEventsTool, profileTool, addTool, backTool } from '../toolbar/tools'
import { readMoreButton, editButton, deleteButton } from '../buttons'
import { routes } from '../routes'
import EventForm from '../event/EventForm'
import Profile from '../profile/Profile'
import { changeShowCompletedEvents } from '../../redux/actions'
import JoinModal from '../joinModal/JoinModal'
import MoreModal from '../moreModal/MoreModal'

export default function ContentWrap() {
    const theme = useTheme()
    const listData = useSelector(state => state.data)
    const userData = useSelector(state => state.user)
    const showCompletedEvents = useSelector(state => state.show_completed_events)
    const location = useLocation()

    const dispatch = useDispatch()

    const [isProfileOpened, setIsProfileOpened] = useState(false)
    const [isJoinModalOpened, setIsJoinModalOpened] = useState(false)
    const [openedEvent, setOpenedEvent] = useState(null)

    const buildTools = useCallback(() => {
        profileTool.callback = () => setIsProfileOpened(true)
        const tools = [profileTool]

        if ([routes.home].includes(location.pathname)) {
            if (userData !== null) {
                if (!userData.is_superuser) {
                    showCompletedEventsTool.callback = () => {
                        dispatch(changeShowCompletedEvents(!showCompletedEvents))
                    }
                    tools.unshift(showCompletedEventsTool)
                    joinTool.callback = () => {
                        setIsJoinModalOpened(true)
                    }
                    tools.unshift(joinTool)
                    if (userData.is_staff) {
                        tools.unshift(createTool)
                    }
                }
                else {
                    tools.unshift(addTool)
                }
            }
        }
        else {
            tools.unshift(backTool)
        }

        return tools
    }, [userData, location, showCompletedEvents])

    const getContent = useCallback(() => {
        let content
        let caption = ''
        switch (location.pathname) {
            case routes.home:
                if (listData.length == 0) {
                    if (userData !== null) {
                        caption = showCompletedEvents?
                        'Вы не завершили ни одного мероприятия'
                        :
                        userData.is_staff ?
                        'Создайте новое мероприятие или присоединитесь к существующему'
                        :
                        userData.is_superuser ?
                        'Добавьте шаблоны документов согласно СТО вашей организации'
                        :
                        'Присоединитесь к мероприятию по коду приглашения'
                    }
                    content = <NotFound additional_caption={caption} />
                }
                else {
                    let preparedListData = listData
                    if (showCompletedEvents) {
                        preparedListData = listData.filter(listItem => listItem.is_complete)
                    }
                    if (preparedListData.length == 0) {
                        caption = 'Вы не завершили ни одного мероприятия'
                        content = <NotFound additional_caption={caption} />
                    }
                    else {
                        content = <ContentList data={preparedListData.map(listItem => {
                            const buttons = Array()

                            const listItemReadMoreButton = {
                                ...readMoreButton,
                                callback: () => setOpenedEvent(listItem)
                            }

                            buttons.push(listItemReadMoreButton)
                            if (listItem.is_complete) {
                                if (listItem.organizer.id == userData.id) {
                                    buttons.push(deleteButton)
                                }
                            }
                            else {
                                buttons.push(editButton)
                            }

                            const itemData = {
                                item_info: <EventShortInfo data={{
                                    event_info: listItem,
                                    user: userData
                                }} />,
                                item_buttons: <ListItemButtons buttons={buttons} />
                            }
                            return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                        })} />
                    }
                }
                break
            case routes.create_event:
                content = <EventForm event_data={null} />
                break
            default:
                content = null
                break
        }

        return content
    }, [location, listData, userData, showCompletedEvents])

    return (
        <Container maxWidth={false} disableGutters sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '100vh'
        }}>
            <Toolbar tools={buildTools()} />
            <Container maxWidth="lg" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: listData.length != 0 || location.pathname === routes.create_event ?
                    theme.palette.info.main : theme.palette.primary.main,
                borderRadius: 10,
                width: '100%',
                padding: '20px',
                margin: 'auto auto 20px auto'
            }}>
                {
                    getContent()
                }
            </Container>
            <Drawer anchor="top" open={isProfileOpened} onClose={() => setIsProfileOpened(false)}>
                <Profile close_callback={() => setIsProfileOpened(false)} data={userData} />
            </Drawer>
            <JoinModal is_opened={isJoinModalOpened} close_callback={() => setIsJoinModalOpened(false)} />
            <MoreModal is_opened={openedEvent !== null} data={{
                event_info: listData,
                user: userData
            }} close_callback={() => setOpenedEvent(null)} />
            <Footer />
        </Container>
    )
}
