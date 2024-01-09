import React, { useCallback, useState } from "react"
import { Stack } from "@mui/material"

import { v4 as uuidV4 } from "uuid"
import DocFormHeader from './DocFormHeader'
import ConfirmModal from "../modal/confirmModal/ConfirmModal"
import Task from '../task/Task'
import { backendEndpoints, host } from "../routes"
import useApi from '../../hooks/useApi'
import FilterModal from "../modal/filterModal/FilterModal"
import { useDispatch } from "react-redux"
import { changeAssignationFlag } from "../../redux/actions"
import NotFound from "../notFound/NotFound"
import NestedTaskFormHeader from "../task/NestedTaskFormHeader"

export default function TableDocForm(props) {
    const { data: { event_data, user, doc_data }, is_roadmap, nested_task } = props

    const callApi = useApi()
    const dispatch = useDispatch()

    const [docFields, setDocFields] = useState(is_roadmap ?
        [...event_data.tasks] : [...doc_data.fields]
    )
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState(-1)
    const [isFilterModalOpened, setIsFilterModalOpened] = useState(false)
    const [filterList, setFilterList] = useState({})
    const [isAscending, setIsAscending] = useState(true)

    const getActualDocData = useCallback((itemToExclude = null) => {
        const className = is_roadmap ? 'Task' : ''
        let fieldForms = Array.from(document.getElementsByClassName(className))
        if (itemToExclude !== null) {
            fieldForms = fieldForms.filter(fieldForm => fieldForm.id != itemToExclude)
        }

        return fieldForms.map(fieldForm => {
            const updatedField = {}
            const foundField = docFields.filter(docField => docField.id == fieldForm.id)

            updatedField.id = foundField[0].id

            fieldForm
                .querySelector('.Task-info')
                .querySelectorAll('input, textarea, select')
                .forEach(input => {
                    let formValue = input.value

                    if (input.id.includes('datetime')) {
                        const timestamp = new Date(input.value).getTime() / 1000
                        if (!isNaN(timestamp) && timestamp !== '') {
                            formValue = timestamp
                        }
                        else {
                            formValue = null
                        }
                    }

                    updatedField[input.id] = formValue

                    if (is_roadmap) {
                        updatedField.users = [...foundField[0].users]
                        updatedField.parent = foundField[0].parent
                    }
                })

            return updatedField
        })
    }, [docFields, is_roadmap])

    const confirmButtonHandler = useCallback((syncFunction) => {
        const actualDocData = syncFunction(
            is_roadmap,
            getActualDocData(deleteItemId),
            docFields,
            deleteItemId
        )

        dispatch(changeAssignationFlag(false))
        setDocFields(actualDocData)
        setIsConfirmModalOpened(false)
    }, [docFields, deleteItemId, is_roadmap])

    const deleteButtonHandler = useCallback((itemId, syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setDeleteItemId(itemId)
        setIsConfirmModalOpened(true)
    }, [is_roadmap, docFields])

    const saveButtonHandler = useCallback((syncFunction) => {
        const formData = {
            event_id: event_data.id,
            doc_id: doc_data.id,
            name: document.querySelector('#Doc-form-header').querySelector('input').value,
            tasks: syncFunction(is_roadmap, getActualDocData(), docFields)
        }

        callApi(`${host}${backendEndpoints.tasks}`, 'PUT', JSON.stringify(formData), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                window.location.reload()
            }
        })

    }, [docFields, event_data, doc_data, is_roadmap])

    const addButtonHandler = useCallback((syncFunction) => {
        const actualDocData = syncFunction(is_roadmap, getActualDocData(), docFields)

        if (is_roadmap) {
            actualDocData.push({
                id: uuidV4(),
                datetime_start: 0,
                datetime_end: null,
                state: 'Не назначена',
                parent: nested_task !== null ? nested_task.id : null,
                name: '',
                users: [],
            })
        }

        dispatch(changeAssignationFlag(false))
        setFilterList({})
        setDocFields(actualDocData)
    }, [is_roadmap, getActualDocData, docFields, nested_task])

    const filterButtonHandler = useCallback((syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setIsFilterModalOpened(true)
    }, [is_roadmap, getActualDocData, docFields])

    const sortButtonHandler = useCallback((syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setIsAscending(!isAscending)
    }, [is_roadmap, docFields, getActualDocData, isAscending])

    const nestedTaskHandler = useCallback((syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
    }, [docFields, getActualDocData, is_roadmap])

    const getFields = useCallback(() => {
        let data = []

        if (docFields.length != 0) {
            if (is_roadmap) {
                if (nested_task !== null) {
                    data = docFields.filter(docField => {
                        return docField.parent === nested_task.id
                    })
                }
                else {
                    data = docFields.filter(docField => docField.parent === null)
                }
                data = data
                    .filter(docField => {
                        let taskStates = true
                        let users = true

                        if (filterList.task_states !== undefined) {
                            taskStates = filterList.task_states.includes(docField.state)
                        }
                        if (filterList.users !== undefined) {
                            users = docField.users
                                .map(fieldUser => fieldUser.user.id)
                                .filter(fieldUserId => {
                                    return filterList.users.includes(fieldUserId)
                                })
                                .length != 0
                        }

                        return taskStates && users
                    })
                    .sort((first, second) => {
                        return isAscending ?
                            first.datetime_start - second.datetime_start
                            :
                            second.datetime_start - first.datetime_start
                    })
                    .map(docField => {
                        const fieldId = `task_${uuidV4()}`
                        return <Task key={fieldId} task={{ ...docField }}
                            user={user}
                            nested_task={nested_task}
                            event_tasks={docFields}
                            event_users={event_data.users}
                            nested_callback={(syncFunction) => {
                                nestedTaskHandler(syncFunction)
                            }}
                            delete_callback={(syncFunction) => {
                                deleteButtonHandler(docField.id, syncFunction)
                            }} />
                    })
            }
        }

        return <Stack direction="row" spacing={4}
            justifyContent="center" alignItems="center"
            useFlexGap flexWrap="wrap">
            {
                data.length != 0 ? data : data = <NotFound />
            }
        </Stack>
    }, [docFields, user, event_data, is_roadmap, isAscending, filterList, nested_task])

    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            {
                nested_task !== null ?
                    <NestedTaskFormHeader task={docFields
                        .filter(docField => docField.id == nested_task.id)[0]}
                        user={user}
                        close_callback={(syncFunction) => nestedTaskHandler(syncFunction)}
                        filter_callback={(syncFunction) => filterButtonHandler(syncFunction)}
                        sort_callback={(syncFunction) => sortButtonHandler(syncFunction)}
                        additional_callback={(syncFunction) => addButtonHandler(syncFunction)} />
                    :
                    <DocFormHeader doc_data={doc_data}
                        user={user}
                        is_roadmap={is_roadmap}
                        save_callback={(syncFunction) => saveButtonHandler(syncFunction)}
                        filter_callback={(syncFunction) => filterButtonHandler(syncFunction)}
                        sort_callback={(syncFunction) => sortButtonHandler(syncFunction)}
                        additional_callback={(syncFunction) => addButtonHandler(syncFunction)} />
            }
            {
                getFields()
            }
            <ConfirmModal is_opened={isConfirmModalOpened}
                close_callback={() => setIsConfirmModalOpened(false)}
                confirm_callback={(syncFunction) => confirmButtonHandler(syncFunction)}
                modal_header={`Удаление ${is_roadmap ? 'задачи' : 'записи'}`}
                modal_content={
                    `Вы действительно хотите удалить эту ${is_roadmap ? 'задачу' : 'запись'}?`
                } />
            {
                doc_data.is_table ?
                    <FilterModal is_opened={isFilterModalOpened}
                        filter_values={
                            is_roadmap ?
                                nested_task !== null ?
                                    docFields
                                        .filter(field => field.id == nested_task.id)[0]
                                        .users
                                    :
                                    event_data.users
                                :
                                []
                        }
                        close_callback={() => setIsFilterModalOpened(false)}
                        confirm_callback={(newFilterList) => {
                            setFilterList(newFilterList)
                            setIsFilterModalOpened(false)
                        }} />
                    :
                    null
            }
        </Stack>
    )
}
