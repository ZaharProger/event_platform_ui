import { Container, Drawer, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { v4 as uuidV4 } from "uuid"
import ContentList from './ContentList'
import Footer from '../footer/Footer'
import Toolbar from '../toolbar/Toolbar'
import NotFound from '../notFound/NotFound'
import ContentListItem from './ContentListItem'
import EventShortInfo from '../event/EventShortInfo'
import ListItemButtons from './ListItemButtons'
import {
    createTool, joinTool, showCompletedEventsTool, mainTool, docsTool, participantsTool,
    completeTool, publishTool, deleteTool,
    profileTool, addTool, backTool
} from '../toolbar/tools'
import { readMoreButton, editButton, deleteButton } from '../buttons'
import { routes, backendEndpoints, host } from '../routes'
import EventForm from '../event/EventForm'
import EventCard from '../event/EventCard'
import Profile from '../profile/Profile'
import {
    changeSelectedCardTab, changeShowCompletedEvents,
    changeData, changeUser
} from '../../redux/actions'
import JoinModal from '../joinModal/JoinModal'
import MoreModal from '../moreModal/MoreModal'
import useApi from '../../hooks/useApi'
import useButton from '../../hooks/useButton'

export default function ContentWrap() {
    const theme = useTheme()

    const callApi = useApi()

    const dispatch = useDispatch()
    const listData = useSelector(state => state.data)
    const userData = useSelector(state => state.user)
    const showCompletedEvents = useSelector(state => state.show_completed_events)

    const location = useLocation()
    const navigate = useNavigate()
    const urlId = useParams().id

    const [isProfileOpened, setIsProfileOpened] = useState(false)
    const [isJoinModalOpened, setIsJoinModalOpened] = useState(false)
    const [openedEvent, setOpenedEvent] = useState(null)

    const initEventCardCallback = () => dispatch(changeSelectedCardTab(mainTool.label))

    const getTool = useButton(true)
    const getButton = useButton(false)

    const buildTools = useCallback(() => {
        const tools = [getTool(profileTool, () => setIsProfileOpened(true))]

        if (location.pathname == routes.home) {
            if (userData !== null) {
                if (!userData.is_superuser) {
                    tools.unshift(getTool(showCompletedEventsTool, () => {
                        dispatch(changeShowCompletedEvents(!showCompletedEvents))
                    }))
                    tools.unshift(getTool(joinTool, () => setIsJoinModalOpened(true)))
                    if (userData.is_staff) {
                        tools.unshift(getTool(createTool))
                    }
                }
                else {
                    tools.unshift(getTool(addTool))
                }
            }
        }
        else if (location.pathname.includes(routes.event_card)) {
            tools.unshift(
                getTool(backTool),
                getTool(mainTool, () => initEventCardCallback()),
                getTool(docsTool),
                getTool(participantsTool),
                getTool(completeTool),
                getTool(publishTool),
                getTool(deleteTool)
            )
        }
        else {
            tools.unshift(getTool(backTool))
        }

        return tools
    }, [userData, location, showCompletedEvents])

    const getContent = useCallback(() => {
        let content = null
        let caption = ''

        if (location.pathname == routes.home) {
            if (listData.length == 0) {
                if (showCompletedEvents) {
                    caption = 'Вы не завершили ни одного мероприятия'
                }
                else if (userData !== null) {
                    if (userData.is_staff) {
                        caption = 'Создайте новое мероприятие или присоединитесь к существующему'
                    }
                    else if (userData.is_superuser) {
                        caption = 'Добавьте шаблоны документов согласно СТО вашей организации'
                    }
                    else {
                        caption = 'Присоединитесь к мероприятию по коду приглашения'
                    }
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

                        buttons.push(getButton(readMoreButton, () => setOpenedEvent(listItem)))
                        if (listItem.is_complete) {
                            const isOrganizer = listItem.users.filter(eventUser => {
                                return eventUser.user.id === userData.id
                                    && eventUser.is_organizer
                            }).length != 0
                            if (isOrganizer) {
                                buttons.push(getButton(deleteButton))
                            }
                        }
                        else {
                            buttons.push(getButton(editButton, () => {
                                initEventCardCallback()
                                navigate(`${routes.event_card}${listItem.id}`)
                            }))
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
        }
        else if (location.pathname == routes.create_event) {
            if (userData !== null) {
                if (userData.is_staff) {
                    content = <EventForm event_data={null} is_edit={false} />
                }
                else {
                    navigate(routes.home)
                }
            }
        }
        else if (location.pathname.includes(routes.event_card)) {
            if (userData !== null) {
                if (listData.length != 0) {
                    content = <EventCard data={{
                        event_data: listData[0],
                        user: userData
                    }} />
                }
                else {
                    navigate(routes.home)
                }
            }
        }

        return content
    }, [location, listData, userData, showCompletedEvents])

    useEffect(() => {
        callApi(`${host}${backendEndpoints.user_account}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                let route = `${host}${backendEndpoints.events}`
                if (urlId !== undefined) {
                    route += `?id=${urlId}`
                }

                callApi(route, 'GET', null, null).then(resData => {
                    dispatch(changeData(resData.status == 200 ? resData.data.data : Array()))
                })
                if (responseData.data !== userData) {
                    dispatch(changeUser(responseData.data.data))
                }
                if (location.pathname === routes.auth) {
                    navigate(routes.home)
                }
            }
            else {
                if (location.pathname !== routes.auth) {
                    dispatch(changeUser(null))
                    navigate(routes.auth)
                }
            }
        })
    }, [location.pathname, urlId])

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
            {
                listData.length != 0 ?
                    <MoreModal is_opened={openedEvent !== null} data={{
                        event_info: listData,
                        user: userData
                    }} close_callback={() => setOpenedEvent(null)} />
                    :
                    null
            }
            <Footer />
        </Container>
    )
}
