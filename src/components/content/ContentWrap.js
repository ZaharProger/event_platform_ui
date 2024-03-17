import { Container, Drawer, Zoom, useTheme } from '@mui/material'
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
import TextDocForm from '../doc/TextDocForm'
import TableDocForm from '../doc/TableDocForm'
import ListItemButtons from './ListItemButtons'
import {
    createTool, joinTool, showCompletedEventsTool, mainTool, docsTool, participantsTool,
    completeTool, publishTool, deleteTool,
    profileTool, addTool, backTool, downloadTool, addGroup, usersTool, registerUser, registerUserTool, addGroupTool
} from '../toolbar/tools'
import {
    aboutEventButton, editButton, deleteButton,
    downloadButton, viewButton
} from '../buttons'
import { routes, backendEndpoints, host } from '../routes'
import EventForm from '../event/EventForm'
import Profile from '../profile/Profile'
import {
    changeSelectedCardTab, changeShowCompletedEvents,
    changeData, changeUser, changeFilterUsers, changeFilterStates,
    changeAssignationList, changeNestedTask, changeUsersSideTasksIds, changeAssignationFlag
} from '../../redux/actions'
import JoinModal from '../modal/joinModal/JoinModal'
import ConfirmModal from '../modal/confirmModal/ConfirmModal'
import MoreModal from '../modal/moreModal/MoreModal'
import useApi from '../../hooks/useApi'
import useButton from '../../hooks/useButton'
import GroupShortInfo from '../group/GroupShortInfo'
import CreateGroupModal from '../modal/createGroupModal/CreateGroupModal'

export default function ContentWrap() {
    const theme = useTheme()

    const callApi = useApi()

    const dispatch = useDispatch()
    const listData = useSelector(state => state.data)
    const userData = useSelector(state => state.user)
    const showCompletedEvents = useSelector(state => state.show_completed_events)
    const selectedTab = useSelector(state => state.selected_card_tab)
    const nestedTask = useSelector(state => state.nested_task)

    const location = useLocation()
    const navigate = useNavigate()
    const eventId = useParams().id
    const docId = useParams().docId
    const groupName = useParams().name
    const userId = useParams().userId

    const [isProfileOpened, setIsProfileOpened] = useState(false)
    const [isJoinModalOpened, setIsJoinModalOpened] = useState(false)
    const [isCreateGroupModalOpened, setIsCreateGroupModalOpened] = useState(false)
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [confirmCallback, setConfirmCallback] = useState(null)
    const [modalHeader, setModalHeader] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [openedEvent, setOpenedEvent] = useState(null)

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
                    if (docId === undefined) {
                        tools.unshift(
                            getTool(downloadTool)
                        )
                    }
                    if (nestedTask === null) {
                        tools.unshift(
                            getTool(backTool)
                        )
                    }
                }
            }
            else {
                if (userData !== null && foundItem.length != 0) {
                    const isOrganizer = foundItem[0].users
                        .filter(user => user.is_organizer && user.user.id == userData.user.id)
                        .length != 0

                    if (userData.is_staff) {
                        const preparedCompleteTool = getTool(completeTool, () => {
                            setIsConfirmModalOpened(true)
                            setConfirmCallback(() => {
                                return () => {
                                    const route = `${host}${backendEndpoints.complete_event}?id=${eventId}`
                                    callApi(route, 'GET', null, null).then(_ => {
                                        setIsConfirmModalOpened(false)
                                        navigate(routes.home)
                                    })
                                }
                            })
                            setModalHeader('Завершение мероприятия')
                            setModalContent('Вы действительно хотите завершить это мероприятие?')
                        })
                        const preparedPublishTool = getTool(publishTool)
                        const preparedDeleteTool = getTool(deleteTool, () => {
                            setIsConfirmModalOpened(true)
                            setConfirmCallback(() => {
                                return () => {
                                    const route = `${host}${backendEndpoints.events}?id=${eventId}`
                                    callApi(route, 'DELETE', null, null).then(_ => {
                                        setIsConfirmModalOpened(false)
                                        navigate(routes.home)
                                    })
                                }
                            })
                            setModalHeader('Удаление мероприятия')
                            setModalContent('Вы действительно хотите удалить это мероприятие?')
                        })
                        tools.unshift(
                            preparedPublishTool,
                            preparedCompleteTool,
                            preparedDeleteTool
                        )

                        if (!isOrganizer) {
                            tools.splice(tools.indexOf(preparedCompleteTool), 1)
                            tools.splice(tools.indexOf(preparedDeleteTool), 1)
                        }
                    }

                    tools.unshift(
                        getTool(docsTool, () => {
                            dispatch(changeSelectedCardTab(docsTool.label))
                            navigate(`${routes.event_card}${eventId}${routes.event_card_docs}`)
                        }, {}, selectedTab),
                        getTool(participantsTool, () => console.log(1), {}, selectedTab),
                    )
                    if (isOrganizer) {
                        tools.unshift(
                            getTool(mainTool, () => {
                                dispatch(changeSelectedCardTab(mainTool.label))
                                navigate(`${routes.event_card}${eventId}`)
                            }, {}, selectedTab),
                        )
                    }
                    tools.unshift(getTool(backTool))
                }
            }
        }
        else if (location.pathname.includes(routes.admin)) {
            if (location.pathname.includes(routes.admin_group_docs)) {
                tools.unshift(
                    getTool(backTool),
                    getTool(docsTool, () => {}),
                    getTool(usersTool, () => {})
                )
            }
            else if (location.pathname.includes(routes.admin_group_users) && userId === undefined) {
                tools.unshift(getTool(
                    registerUserTool, 
                    () => {}
                ))
            }
            else {
                tools.unshift(getTool(addGroupTool, () => setIsCreateGroupModalOpened(true)))
            }
        }
        else {
            tools.unshift(getTool(backTool))
        }

        return tools
    }, [userData, location, showCompletedEvents, selectedTab, foundItem, nestedTask, userId])

    const getContent = useCallback(() => {
        let content = null
        let caption = ''

        if (location.pathname == routes.home) {
            if (userData !== null) {
                if (userData.is_superuser) {
                    navigate(routes.admin)
                }
                else if (listData.length == 0) {
                    if (showCompletedEvents) {
                        caption = 'Вы не завершили ни одного мероприятия'
                    }
                    else if (userData.is_staff) {
                        caption = 'Создайте новое мероприятие или присоединитесь к существующему'
                    }
                    else {
                        caption = 'Присоединитесь к мероприятию по коду приглашения'
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

                            const isOrganizer = listItem.users.filter(user => {
                                return user.user.id === userData.user.id && user.is_organizer
                            }).length != 0

                            buttons.push(getButton(aboutEventButton, () => setOpenedEvent(listItem)))
                            if (listItem.is_complete) {
                                if (isOrganizer) {
                                    buttons.push(getButton(deleteButton, () => {
                                        setIsConfirmModalOpened(true)
                                        setConfirmCallback(() => {
                                            return () => {
                                                const route = `${host}${backendEndpoints.events}?id=${listItem.id}`
                                                callApi(route, 'DELETE', null, null).then(_ => {
                                                    setIsConfirmModalOpened(false)
                                                    window.location.reload()
                                                })
                                            }
                                        })
                                        setModalHeader('Удаление мероприятия')
                                        setModalContent('Вы действительно хотите удалить это мероприятие?')
                                    }))
                                }
                            }
                            else {
                                buttons.push(getButton(userData.is_staff ? editButton : viewButton, () => {
                                    let route
                                    if (isOrganizer) {
                                        dispatch(changeSelectedCardTab(mainTool.label))
                                        route = `${routes.event_card}${listItem.id}`
                                    }
                                    else if (userData.is_staff) {
                                        dispatch(changeSelectedCardTab(participantsTool.label))
                                        route = `${routes.event_card}${listItem.id}${routes.event_card_participants}`
                                    }
                                    else {
                                        dispatch(changeSelectedCardTab(docsTool.label))
                                        route = `${routes.event_card}${listItem.id}${routes.event_card_docs}`
                                    }

                                    navigate(route)
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
        }
        else if (location.pathname == routes.create_event) {
            if (userData !== null) {
                if (userData.is_staff) {
                    content = <EventForm event_data={null} is_edit={false} />
                }
                else if (userData.is_superuser) {
                    navigate(routes.admin)
                }
                else {
                    navigate(routes.home)
                }
            }
        }
        else if (location.pathname.includes(routes.event_card)) {
            if (userData !== null && foundItem.length != 0) {
                if (userData.is_superuser) {
                    navigate(routes.admin)
                }
                else if (!userData.is_superuser && !foundItem[0].is_complete) {
                    const isOrganizer = foundItem[0].users
                        .filter(user => user.is_organizer && user.user.id == userData.user.id)
                        .length != 0

                    if (location.pathname.includes(routes.event_card_docs)) {
                        dispatch(changeSelectedCardTab(docsTool.label))
                        if (docId !== undefined) {
                            const foundDoc = foundItem[0].docs.filter(doc => doc.id == docId)[0]
                            const docData = {
                                event_data: {
                                    id: foundItem[0].id,
                                },
                                user: userData,
                                doc_data: foundDoc
                            }
                            if (foundDoc.is_table) {
                                const docTypes = localStorage.getItem('doc_types') !== null ?
                                    JSON.parse(localStorage.getItem('doc_types')) : []
                                let roadMapDocType = ''
                                let moneyDocType = ''
                                if (docTypes.length != 0) {
                                    roadMapDocType = docTypes.filter(docType => docType.label == 'Roadmap')
                                    roadMapDocType = roadMapDocType[0].value.toLowerCase()
                                    moneyDocType = docTypes.filter(docType => docType.label == 'Money')
                                    moneyDocType = moneyDocType[0].value.toLowerCase()
                                }

                                let isRoadmap = false
                                let isMoney = false
                                if (foundDoc.doc_type.toLowerCase().includes(roadMapDocType)) {
                                    isRoadmap = true
                                    docData.event_data.users = foundItem[0].users
                                    docData.event_data.tasks = foundItem[0].tasks
                                }
                                else if (foundDoc.doc_type.toLowerCase().includes(moneyDocType)) {
                                    isMoney = true
                                }
                                content = <TableDocForm data={docData}
                                    nested_task={nestedTask}
                                    is_money={isMoney}
                                    is_roadmap={isRoadmap} />
                            }
                            else {
                                content = <TextDocForm data={docData} />
                            }
                        }
                        else if (foundItem[0].docs.length != 0) {
                            content = <ContentList data={foundItem[0].docs.map(doc => {
                                const buttons = [
                                    getButton(downloadButton, () => {
                                        const route = `${host}${backendEndpoints.docs}?id=${doc.id}`
                                        callApi(route, 'GET', null, null, true).then(responseData => {
                                            if (responseData.status == 200) {
                                                const contentWrap = document.querySelector('#Content-wrap')

                                                const downloadRef = document.createElement('a')
                                                downloadRef.href = URL.createObjectURL(responseData.data)
                                                downloadRef.download = 'doc.xlsx'
                                                downloadRef.style.display = 'none'
                                                contentWrap.appendChild(downloadRef)

                                                downloadRef.click()
                                                URL.revokeObjectURL(downloadRef.href);
                                                contentWrap.removeChild(downloadRef)
                                            }
                                        })
                                    }),
                                    getButton(userData.is_staff ? editButton : viewButton, () => {
                                        dispatch(changeSelectedCardTab(docsTool.label))
                                        const route =
                                            `${routes.event_card}${eventId}${routes.event_card_docs}${doc.id}`
                                        navigate(route)
                                    })
                                ]
                                const itemData = {
                                    item_info: <DocShortInfo data={{
                                        doc_info: doc
                                    }} />,
                                    item_buttons: <ListItemButtons buttons={buttons} />
                                }
                                return <ContentListItem key={`list_item_${uuidV4()}`} data={itemData} />
                            })} />
                        }
                        else {
                            const caption = userData.is_staff ?
                                'Создайте новый документ для вашего мероприятия!'
                                :
                                'Подождите. Скоро здесь появится что-нибудь интересное!'
                            content = <NotFound additional_caption={caption} />
                        }
                    }
                    else if (location.pathname.includes(routes.event_card_participants)) {
                        dispatch(changeSelectedCardTab(participantsTool.label))
                        caption = 'Скоро здесь появится что-нибудь интересное'
                        content = <NotFound additional_caption={caption} />
                    }
                    else {
                        if (isOrganizer) {
                            dispatch(changeSelectedCardTab(mainTool.label))
                            content = <EventForm event_data={foundItem[0]} is_edit={true} />
                        }
                        else {
                            navigate(routes.home)
                        }
                    }
                }
                else {
                    navigate(routes.home)
                }
            }
        }
        else if (location.pathname.includes(routes.admin)) {
            if (userData !== null) {
                if (userData.is_superuser) {
                    if (listData.length == 0) {
                        if (location.pathname.includes(routes.admin_group_docs)) {
                            caption = 'Добавьте шаблоны пакета документов для этой группы'
                        }
                        else if (location.pathname.includes(routes.admin_group_users)) {
                            caption = 'Добавьте новых пользователей в группу'
                        }
                        else {
                            caption = 'Создайте новую группу'
                        }

                        content = <NotFound additional_caption={caption} />
                    }
                    else {
                        content = <ContentList data={listData.map(listItem => {
                            const buttons = []
                            buttons.push(
                                getButton(editButton, () => {
                                    let route = `${routes.admin}${routes.admin_group}`

                                    if (location.pathname == routes.admin) {
                                        route += `${listItem.name}${routes.admin_group_docs}`
                                    }
                                    else if (location.pathname.includes(routes.admin_group_docs)) {
                                        route += `${groupName}${routes.admin_group_docs}${listItem.id}`
                                    }
                                    else if (location.pathname.includes(routes.admin_group_users)) {
                                        route += `${groupName}${routes.admin_group_users}${listItem.id}`
                                    }

                                    navigate(route)
                                }),
                                getButton(deleteButton, () => {
                                    setIsConfirmModalOpened(true)
                                    let route = `${host}`
                                    let modalHeader
                                    let modalContent

                                    if (location.pathname == routes.admin) {
                                        route += `${backendEndpoints.user_groups}?name=${listItem.name}`
                                        modalHeader = 'Удаление группы'
                                        modalContent = 'Вы действительно хотите удалить эту группу?'
                                    }
                                    else if (location.pathname.includes(routes.admin_group_docs)) {
                                        route += `${backendEndpoints.templates}?id=${listItem.id}`
                                        modalHeader = 'Удаление шаблона документа'
                                        modalContent = 'Вы действительно хотите удалить шаблон этого документа?'
                                    }
                                    else if (location.pathname.includes(routes.admin_group_users)) {
                                        route += `${backendEndpoints.user_account}?id=${listItem.id}`
                                        modalHeader = 'Удаление пользователя'
                                        modalContent = 'Вы действительно хотите удалить этого пользователя из системы?'
                                    }

                                    setConfirmCallback(() => {
                                        return () => {
                                            callApi(route, 'DELETE', null, null).then(_ => {
                                                setIsConfirmModalOpened(false)
                                                window.location.reload()
                                            })
                                        }
                                    })

                                    setModalHeader(modalHeader)
                                    setModalContent(modalContent)
                                })
                            )

                            let itemInfo
                            
                            if (location.pathname == routes.admin) {
                                itemInfo = <GroupShortInfo data={{group_info: listItem}} />
                            }
                            else if (location.pathname.includes(routes.admin_group_docs)) {
                                itemInfo = null
                            }
                            else if (location.pathname.includes(routes.admin_group_users)) {
                                itemInfo = null
                            }

                            const itemData = {
                                item_info: itemInfo,
                                item_buttons: <ListItemButtons buttons={buttons} />
                            }
                            return <ContentListItem key={`list_item_${uuidV4()}`} 
                                data={itemData} />
                        })} />
                    }
                }
                else {
                    navigate(routes.home)
                }
            }
            else {
                navigate(routes.home)
            }
        }

        return content
}, [location, listData, userData, showCompletedEvents, foundItem, nestedTask])

useEffect(() => {
    callApi(`${host}${backendEndpoints.user_account}`, 'GET', null, null).then(responseData => {
        dispatch(changeFilterUsers(Array()))
        dispatch(changeData(Array()))
        dispatch(changeFilterStates(Array()))
        dispatch(changeAssignationList(Array()))
        dispatch(changeUsersSideTasksIds(Array()))
        dispatch(changeAssignationFlag(false))
        dispatch(changeNestedTask(null))

        if (responseData.status == 200) {
            let route

            if (responseData.data.data.is_superuser) {
                route = `${host}${backendEndpoints.user_groups}`
            }
            else {
                route = `${host}${backendEndpoints.events}`
                if (eventId !== undefined) {
                    route += `?id=${eventId}`
                }
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
                navigate(responseData.data.data.is_superuser? routes.admin : routes.home)
            }
        }
        else {
            if (location.pathname !== routes.auth) {
                dispatch(changeUser(null))
                navigate(routes.auth)
            }
        }
    })
}, [location.pathname, eventId, docId])

useEffect(() => {
    callApi(`${host}${backendEndpoints.settings}`, 'GET', null, null).then(responseData => {
        if (responseData.status == 200) {
            localStorage.setItem('event_types', JSON.stringify(responseData.data.data.event_types))
            localStorage.setItem('task_states', JSON.stringify(responseData.data.data.task_states))
            localStorage.setItem('doc_types', JSON.stringify(responseData.data.data.doc_types))
        }
    })
}, [])

const content = getContent()

return (
    <Container id="Content-wrap" maxWidth={false} disableGutters sx={{
        backgroundColor: theme.palette.secondary,
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        height: '100vh'
    }}>
        {
            content !== null ?
                <Toolbar tools={buildTools()} nested_task={nestedTask} />
                :
                null
        }
        <Zoom in={true} timeout={600}>
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
        </Zoom>
        <Drawer anchor="top" open={isProfileOpened}
            onClose={() => setIsProfileOpened(false)}>
            <Profile close_callback={() => setIsProfileOpened(false)} data={userData} />
        </Drawer>
        <JoinModal is_opened={isJoinModalOpened}
            close_callback={() => setIsJoinModalOpened(false)} />
        <CreateGroupModal is_opened={isCreateGroupModalOpened}
            close_callback={() => setIsCreateGroupModalOpened(false)} />
        <MoreModal is_opened={openedEvent !== null} data={{
            event_info: openedEvent,
            user: userData
        }} close_callback={() => setOpenedEvent(null)} />
        <ConfirmModal is_opened={isConfirmModalOpened}
            close_callback={() => setIsConfirmModalOpened(false)}
            confirm_callback={() => confirmCallback()}
            modal_header={modalHeader}
            modal_content={modalContent} />
        <Footer />
    </Container>
)
}
