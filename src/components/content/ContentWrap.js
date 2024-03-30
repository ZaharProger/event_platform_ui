import { Container, Drawer, Zoom, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

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
    completeTool, deleteTool, profileTool, addTool, backTool, downloadTool, usersTool,
    registerUserTool, addGroupTool, publishTool
} from '../toolbar/tools'
import {
    aboutEventButton, editButton, deleteButton,
    downloadButton, viewButton, applyButton
} from '../buttons'
import { routes, backendEndpoints, host } from '../routes'
import EventForm from '../event/EventForm'
import Profile from '../profile/Profile'
import {
    changeSelectedCardTab, changeShowCompletedEvents,
    changeData, changeUser, changeFilterUsers
} from '../../redux/actions'
import JoinModal from '../modal/joinModal/JoinModal'
import ConfirmModal from '../modal/confirmModal/ConfirmModal'
import MoreModal from '../modal/moreModal/MoreModal'
import useApi from '../../hooks/useApi'
import useButton from '../../hooks/useButton'
import GroupShortInfo from '../group/GroupShortInfo'
import CreateGroupModal from '../modal/createGroupModal/CreateGroupModal'
import UsersListItem from '../usersList/UsersListItem'
import RegisterModal from '../modal/registerModal/RegisterModal'
import useUsersList from '../../hooks/useUsersList'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import useRoute from '../../hooks/useRoute'
import GroupForm from '../group/GroupForm'
import GroupDocForm from '../group/GroupDocForm'

export default function ContentWrap() {
    const theme = useTheme()
    const textFieldStyles = useTextFieldStyles('outlined')

    const callApi = useApi()

    const getUsersList = useUsersList(false, false)

    const dispatch = useDispatch()
    const listData = useSelector(state => state.data)
    const userData = useSelector(state => state.user)
    const showCompletedEvents = useSelector(state => state.show_completed_events)
    const selectedTab = useSelector(state => state.selected_card_tab)
    const nestedTask = useSelector(state => state.nested_task)
    const filterUsers = useSelector(state => state.filter_users)

    const location = useLocation()
    const navigate = useRoute()
    const eventId = useParams().id
    const eventDocId = useParams().eventDocId
    const groupDocName = useParams().groupDocName
    const groupName = useParams().name
    const userId = useParams().userId

    const [isProfileOpened, setIsProfileOpened] = useState(false)
    const [isJoinModalOpened, setIsJoinModalOpened] = useState(false)
    const [isCreateGroupModalOpened, setIsCreateGroupModalOpened] = useState(false)
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [confirmCallback, setConfirmCallback] = useState(null)
    const [isRegisterModalOpened, setIsRegisterModalOpened] = useState(false)
    const [modalHeader, setModalHeader] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [openedEvent, setOpenedEvent] = useState(null)

    const getTool = useButton(true)
    const getButton = useButton(false)

    let foundItem
    if (location.pathname.includes(routes.event_card)) {
        foundItem = listData.filter(listItem => listItem.id == eventId)
    }
    else if (location.pathname.includes(routes.admin_group)) {
        if (location.pathname.includes(routes.admin_group_docs)) {
            foundItem = {
                objects: listData.docs !== undefined ?
                    listData.docs.map(groupDoc => {
                        return {
                            ...groupDoc
                        }
                    })
                    :
                    []
            }
        }
        else if (location.pathname.includes(routes.admin_group_users)) {
            foundItem = {
                objects: listData.users !== undefined ?
                    listData.users.map(groupUser => {
                        return {
                            ...groupUser
                        }
                    })
                    :
                    []
            }
        }
        else {
            foundItem = {
                name: listData.name
            }
        }
    }

    const getSearchResults = useCallback((dataToFilter, searchData) => {
        let customCallback = location.pathname.includes(routes.admin_group) ?
            (idToDelete) => {
                const route = `${host}${backendEndpoints.user_account}?id=${idToDelete}`
                const modalHeader = 'Удаление пользователя'
                const modalContent = 'Вы действительно хотите удалить этого пользователя из системы?'

                setConfirmCallback(() => {
                    return () => {
                        callApi(route, 'DELETE', null, null).then(_ => {
                            setIsConfirmModalOpened(false)
                            navigate(null)
                        })
                    }
                })

                setModalHeader(modalHeader)
                setModalContent(modalContent)
                setIsConfirmModalOpened(true)
            }
            :
            null

        return dataToFilter.length != 0 ?
            dataToFilter
                .filter(itemValue => itemValue.user.name.toLowerCase()
                    .includes(searchData.toLowerCase())
                )
                .sort((first, second) => first.user.name.localeCompare(second.user.name))
                .map(foundItem => {
                    return <UsersListItem key={`user_${uuidV4()}`}
                        for_modal={false}
                        is_editable={true}
                        for_admin={location.pathname.includes(routes.admin_group)}
                        user={foundItem}
                        custom_callback={(idToDelete) => customCallback(idToDelete)}
                    />
                })
            :
            []
    }, [location])

    const updateEventParticipants = useCallback((participants) => {
        const body = {
            event_id: eventId,
            users: participants.map(participant => {
                return {
                    id: participant
                }
            })
        }
        callApi(`${host}${backendEndpoints.participants}`, 'POST', JSON.stringify(body), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                navigate(null)
            }
        })
    }, [eventId])

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
                    if (eventDocId === undefined) {
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
            else if (location.pathname.includes(routes.event_card_participants)) {
                tools.unshift(getTool(backTool))
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
                        getTool(participantsTool, () => {
                            dispatch(changeSelectedCardTab(publishTool.label))
                            navigate(`${routes.event_card}${eventId}${routes.event_card_participants}`)
                        }, {}, selectedTab),
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
        else if (location.pathname.includes(routes.admin_group)) {
            if (location.pathname.includes(routes.admin_group_users)) {
                tools.unshift(
                    getTool(backTool),
                    getTool(registerUserTool, () => setIsRegisterModalOpened(true))
                )
            }
            else if (location.pathname.includes(routes.admin_group_docs)) {
                tools.unshift(getTool(backTool))
            }
            else if (groupName !== undefined) {
                tools.unshift(
                    getTool(backTool),
                    getTool(mainTool, () => { }, {}, selectedTab),
                    getTool(docsTool, () => {
                        const route = `${routes.admin_group}/${groupName}${routes.admin_group_docs}`
                        navigate(route)
                    }),
                    getTool(usersTool, () => {
                        const route = `${routes.admin_group}/${groupName}${routes.admin_group_users}`
                        navigate(route)
                    })
                )
            }
            else {
                tools.unshift(getTool(addGroupTool, () => setIsCreateGroupModalOpened(true)))
            }
        }
        else {
            tools.unshift(getTool(backTool))
        }

        return tools
    }, [userData, location, showCompletedEvents, selectedTab, groupName,
        foundItem, nestedTask, userId, eventDocId])

    const getContent = useCallback(() => {
        let content = null
        let caption = ''

        if (location.pathname == routes.home) {
            if (userData !== null) {
                if (userData.is_superuser) {
                    navigate(routes.admin_group)
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
                                                    navigate(null)
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
                    navigate(routes.admin_group)
                }
                else {
                    navigate(routes.home)
                }
            }
        }
        else if (location.pathname.includes(routes.event_card)) {
            if (userData !== null) {
                if (userData.is_superuser) {
                    navigate(routes.admin_group)
                }
                else if (foundItem.length != 0) {
                    if (!foundItem[0].is_complete) {
                        const isOrganizer = foundItem[0].users
                            .filter(user => user.is_organizer && user.user.id == userData.user.id)
                            .length != 0

                        if (location.pathname.includes(routes.event_card_docs)) {
                            dispatch(changeSelectedCardTab(docsTool.label))
                            if (eventDocId !== undefined) {
                                const foundDoc = foundItem[0].docs.filter(doc => doc.id == eventDocId)[0]
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
                                                    downloadRef.download = `doc.${doc.is_table? 'xlsx' : 'docx'}`
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
                }
                else if (location.pathname.includes(routes.event_card_participants)) {
                    dispatch(changeSelectedCardTab(participantsTool.label))
                    content = getUsersList(
                        { text_field_styles: textFieldStyles },
                        'search_filter',
                        (searchData) => getSearchResults(listData, searchData),
                        [getButton(applyButton, () => updateEventParticipants(filterUsers))]
                    )
                }
            }
        }
        else if (location.pathname.includes(routes.admin_group)) {
            if (userData !== null) {
                if (userData.is_superuser) {
                    let areObjectListEmpty = false

                    if (location.pathname.includes(routes.admin_group_docs) ||
                        location.pathname.includes(routes.admin_group_users)) {
                        if (foundItem !== undefined) {
                            areObjectListEmpty = foundItem.objects.length == 0
                        }
                        else {
                            areObjectListEmpty = true
                        }
                    }

                    if (listData.length == 0 || (areObjectListEmpty && listData.length != 0)) {
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
                        let preparedListData
                        if (location.pathname == routes.admin_group) {
                            preparedListData = listData instanceof Array?
                                listData.map(listItem => listItem.name)
                                :
                                []
                        }
                        else {
                            if (groupName !== undefined) {
                                dispatch(changeSelectedCardTab(mainTool.label))
                            }
                            preparedListData = foundItem.objects
                        }

                        if (location.pathname.includes(routes.admin_group_users)) {
                            content = getUsersList(
                                { text_field_styles: textFieldStyles },
                                'search_filter',
                                (searchData) => getSearchResults(preparedListData, searchData)
                            )
                        }
                        else {
                            if (groupDocName !== undefined) {
                                const groupDocData = preparedListData.filter(listItem => {
                                    return listItem.name == groupDocName
                                })
                                content = <GroupDocForm user={userData}
                                    doc_name={groupDocName}
                                    group_name={groupName}
                                    data={groupDocData[0]} />
                            }
                            else if (location.pathname.includes(routes.admin_group_docs) || groupName === undefined) {
                                content = <ContentList data={preparedListData.map(listItem => {
                                    const buttons = [
                                        getButton(deleteButton, () => {
                                            setIsConfirmModalOpened(true)
                                            let route = `${host}`
                                            let modalHeader
                                            let modalContent

                                            if (location.pathname == routes.admin_group) {
                                                route += `${backendEndpoints.user_groups}?name=${listItem}`
                                                modalHeader = 'Удаление группы'
                                                modalContent = 'Вы действительно хотите удалить эту группу?'
                                            }
                                            else {
                                                route += `${backendEndpoints.templates}?id=${listItem.id}`
                                                modalHeader = 'Удаление шаблона документа'
                                                modalContent = 'Вы действительно хотите удалить шаблон этого документа?'
                                            }

                                            setConfirmCallback(() => {
                                                return () => {
                                                    callApi(route, 'DELETE', null, null).then(_ => {
                                                        setIsConfirmModalOpened(false)
                                                        navigate(null)
                                                    })
                                                }
                                            })

                                            setModalHeader(modalHeader)
                                            setModalContent(modalContent)
                                        }),
                                        getButton(editButton, () => {
                                            let route = `${routes.admin_group}/`

                                            if (location.pathname == routes.admin_group) {
                                                dispatch(changeSelectedCardTab(mainTool.label))
                                                route += `${listItem}`
                                            }
                                            else {
                                                route += `${groupName}${routes.admin_group_docs}/${listItem.name}`
                                            }

                                            navigate(route)
                                        })
                                    ]

                                    const itemData = {
                                        item_info: location.pathname == routes.admin_group ?
                                            <GroupShortInfo data={{ group_info: listItem }} />
                                            :
                                            <DocShortInfo data={{
                                                doc_info: listItem
                                            }} />,
                                        item_buttons: <ListItemButtons buttons={buttons} />
                                    }
                                    return <ContentListItem key={`list_item_${uuidV4()}`}
                                        data={itemData} />
                                })} />
                            }
                            else {
                                content = <GroupForm group_info={foundItem} />
                            }
                        }
                    }
                }
                else {
                    navigate(routes.home)
                }
            }
        }

        return content
    }, [location, listData, userData, showCompletedEvents,
        foundItem, nestedTask, eventDocId, groupDocName, groupName])

    useEffect(() => {
        callApi(`${host}${backendEndpoints.user_account}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                let route

                if (responseData.data.data.is_superuser) {
                    route = `${host}${backendEndpoints.user_groups}`
                    if (groupName !== undefined) {
                        route += `?name=${groupName}`
                    }
                }
                else if (location.pathname.includes(routes.event_card_participants)) {
                    route = `${host}${backendEndpoints.users}?id=${eventId}`
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
                        if (location.pathname.includes(routes.event_card_participants)) {
                            const eventUserIds = resData.data.data
                                .filter(item => item.is_event_member)
                                .map(item => item.user.id)
                            dispatch(changeFilterUsers(eventUserIds))
                        }

                        if (location.pathname === routes.auth) {
                            navigate(responseData.data.data.is_superuser ? routes.admin_group : routes.home)
                        }
                    }
                    else {
                        dispatch(changeData(Array()))
                        navigate('-1')
                    }
                })

                if (responseData.data !== userData) {
                    dispatch(changeUser(responseData.data.data))
                }
            }
            else {
                if (location.pathname !== routes.auth) {
                    dispatch(changeUser(null))
                    navigate(routes.auth)
                }
            }
        })
    }, [location.pathname, eventId, groupName])

    useEffect(() => {
        callApi(`${host}${backendEndpoints.settings}`, 'GET', null, null).then(responseData => {
            if (responseData.status == 200) {
                localStorage.setItem('event_types', JSON.stringify(responseData.data.data.event_types))
                localStorage.setItem('task_states', JSON.stringify(responseData.data.data.task_states))
                localStorage.setItem('doc_types', JSON.stringify(responseData.data.data.doc_types))
                localStorage.setItem('field_types', JSON.stringify(responseData.data.data.field_types))
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
            <RegisterModal is_opened={isRegisterModalOpened} group_name={groupName}
                close_callback={() => setIsRegisterModalOpened(false)} />
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
