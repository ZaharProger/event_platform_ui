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
import DocShortInfo from '../doc/DocShortInfo'
import ListItemButtons from './ListItemButtons'
import {
    createTool, joinTool, showCompletedEventsTool, mainTool, docsTool, participantsTool,
    completeTool, publishTool, deleteTool,
    profileTool, addTool, backTool, downloadTool
} from '../toolbar/tools'
import { readMoreButton, editButton, deleteButton } from '../buttons'
import { routes, backendEndpoints, host } from '../routes'
import EventForm from '../event/EventForm'
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
    const selectedTab = useSelector(state => state.selected_card_tab)

    const location = useLocation()
    const navigate = useNavigate()
    const eventId = useParams().id

    const [isProfileOpened, setIsProfileOpened] = useState(false)
    const [isJoinModalOpened, setIsJoinModalOpened] = useState(false)
    const [openedEvent, setOpenedEvent] = useState(null)

    const initEventCardCallback = (item=null, redirect=false) => {
        dispatch(changeSelectedCardTab(mainTool.label))
        if (redirect) {
            const itemId = item === null? eventId : item.id
            navigate(`${routes.event_card}${itemId}`)
        }
    }
    const docsEventCardCallback = (item=null, redirect=false) => {
        dispatch(changeSelectedCardTab(docsTool.label))
        if (redirect) {
            const itemId = item === null? '' : item.id
            navigate(`${routes.event_card}${eventId}${routes.event_card_docs}${itemId}`)
        }
    }
    const participantsEventCardCallback = () => dispatch(changeSelectedCardTab(participantsTool.label))

    const getTool = useButton(true)
    const getButton = useButton(false)

    const foundItem = listData.filter(listItem => listItem.id == eventId)

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
            if (location.pathname.includes(routes.event_card_docs)) {
                if (userData !== null) {
                    tools.unshift(
                        getTool(downloadTool)
                    )
                    if (userData.is_staff) {
                        tools.unshift(
                            getTool(createTool)
                        )
                    }
                    tools.unshift(
                        getTool(backTool)
                    )
                }
            }
            else {
                if (userData !== null && foundItem.length != 0) {
                    if (userData.is_staff) {
                        const isOrganizer = foundItem[0].users
                            .filter(user => user.is_organizer && user.id == userData.id).length != 0
                        tools.unshift(
                            getTool(completeTool),
                            getTool(publishTool),
                            getTool(deleteTool)
                        )
                        if (!isOrganizer) {
                            tools.splice(tools.indexOf(completeTool), 1)
                            tools.splice(tools.indexOf(deleteTool), 1)
                        }
                    }
                }
                tools.unshift(
                    getTool(docsTool, () => docsEventCardCallback(null, true), {}, selectedTab),
                    getTool(participantsTool, () => console.log(1), {}, selectedTab),
                )
                if (userData.is_staff) {
                    tools.unshift(
                        getTool(mainTool, () => initEventCardCallback(null, true), {}, selectedTab),
                    )
                }
                tools.unshift(getTool(backTool))
            }
        }
        else {
            tools.unshift(getTool(backTool))
        }

        return tools
    }, [userData, location, showCompletedEvents, selectedTab, foundItem])

    const getContent = useCallback(() => {
        let content = null
        let caption = ''

        if (location.pathname == routes.home) {
            if (listData.length == 0) {
                if (userData !== null) {
                    if (userData.is_superuser) {
                        caption = 'Добавьте шаблоны документов согласно СТО вашей организации'
                    }
                    else {
                        if (showCompletedEvents) {
                            caption = 'Вы не завершили ни одного мероприятия'
                        }
                        else if (userData.is_staff) {
                            caption = 'Создайте новое мероприятие или присоединитесь к существующему'
                        }
                        else {
                            caption = 'Присоединитесь к мероприятию по коду приглашения'
                        }
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
                            const isOrganizer = listItem.users.filter(user => {
                                return user.user.id === userData.user.id && user.is_organizer
                            }).length != 0
                            if (isOrganizer) {
                                buttons.push(getButton(deleteButton))
                            }
                        }
                        else {
                            buttons.push(getButton(editButton, () => {
                                if (userData.is_staff) {
                                    initEventCardCallback(listItem, true)
                                }
                                else {
                                    docsEventCardCallback(null, true)
                                }
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
            if (userData !== null && foundItem.length != 0) {
                if (!userData.is_superuser && !foundItem[0].is_complete) {
                    if (location.pathname.includes(routes.event_card_docs)) {
                        docsEventCardCallback()
                        content = <ContentList data={foundItem[0].docs.map(doc => {
                            const buttons = Array()

                            if (userData.is_staff) {
                                buttons.push(
                                    getButton(deleteButton)
                                )
                            }
                            buttons.push(
                                getButton(editButton, () => {
                                    docsEventCardCallback(doc, true)
                                })
                            )

                            const itemData = {
                                item_info: <DocShortInfo data={{
                                    doc_info: doc
                                }} />,
                                item_buttons: <ListItemButtons buttons={buttons} />
                            }
                            return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                        })} />
                    }
                    else if (location.pathname.includes(routes.event_card_participants)) {
                        participantsEventCardCallback()
                    }
                    else {
                        initEventCardCallback()
                        content = <EventForm event_data={foundItem[0]} is_edit={true} />
                    }
                }
                else {
                    navigate(routes.home)
                }
            }
        }

        return content
    }, [location, listData, userData, showCompletedEvents, foundItem])

    useEffect(() => {
        callApi(`${host}${backendEndpoints.user_account}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                let route = `${host}${backendEndpoints.events}`
                if (eventId !== undefined) {
                    route += `?id=${eventId}`
                }

                callApi(route, 'GET', null, null).then(resData => {
                    if (resData.status == 200) {
                        dispatch(changeData(resData.data.data))
                    }
                    else {
                        dispatch(changeData(Array()))
                        navigate('-1')
                    }
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
    }, [location.pathname, eventId])

    const content = getContent()

    return (
        <Container maxWidth={false} disableGutters sx={{
            backgroundColor: theme.palette.secondary,
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '100vh'
        }}>
            {
                content !== null ? <Toolbar tools={buildTools()} /> : null
            }
            <Container maxWidth="lg" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: listData.length != 0 || location.pathname === routes.create_event ?
                    theme.palette.info.main : theme.palette.primary.main,
                borderRadius: 10,
                width: '100%',
                padding: '20px',
                margin: '20px auto 20px auto'
            }}>
                {
                    content
                }
            </Container>
            <Drawer anchor="top" open={isProfileOpened} onClose={() => setIsProfileOpened(false)}>
                <Profile close_callback={() => setIsProfileOpened(false)} data={userData} />
            </Drawer>
            <JoinModal is_opened={isJoinModalOpened} close_callback={() => setIsJoinModalOpened(false)} />
            <MoreModal is_opened={openedEvent !== null} data={{
                event_info: openedEvent,
                user: userData
            }} close_callback={() => setOpenedEvent(null)} />
            <Footer />
        </Container>
    )
}
