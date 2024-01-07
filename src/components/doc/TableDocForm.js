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

export default function TableDocForm(props) {
    const { data: { event_data, user, doc_data }, is_roadmap } = props

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
    console.log(filterList);

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

            fieldForm.querySelectorAll('input, textarea, select').forEach(input => {
                let formValue = input.value

                if (input.id.includes('datetime')) {
                    const timestamp = (new Date(input.value).getTime() / 1000).toString()
                    if (timestamp != 'NaN' && timestamp != '') {
                        formValue = timestamp
                    }
                }

                updatedField[input.id] = formValue
                if (is_roadmap) {
                    updatedField.users = [...foundField[0].users]
                    updatedField.nested_tasks = [...foundField[0].nested_tasks]
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
                datetime_start: '',
                datetime_end: '',
                state: 'Не назначена',
                nested_tasks: [],
                name: '',
                users: [],
            })
        }

        dispatch(changeAssignationFlag(false))
        setFilterList({})
        setDocFields(actualDocData)
    }, [is_roadmap, getActualDocData, docFields])

    const filterButtonHandler = useCallback((syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setIsFilterModalOpened(true)
    }, [is_roadmap, getActualDocData, docFields])

    const syncButtonHandler = useCallback((syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setIsAscending(!isAscending)
    }, [is_roadmap, docFields, getActualDocData, isAscending])

    const getFields = useCallback(() => {
        let data = []

        if (docFields.length != 0) {
            if (is_roadmap) {
                const earliestStartDate = docFields
                    .sort((first, second) => {
                        return first.datetime_start - second.datetime_start
                    })
                    [0].datetime_start
                const latestEndDate = docFields
                    .sort((first, second) => {
                        return second.datetime_end - first.datetime_end
                    })
                    [0].datetime_end

                data = docFields
                    .filter(docField => {
                        let taskStates = true
                        let users = true

                        if (filterList.task_states !== undefined) {
                            taskStates = filterList.task_states
                                .includes(docField.state)
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
                            event_tasks={docFields}
                            event_users={event_data.users}
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
    })

    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            <DocFormHeader doc_data={doc_data} user={user}
                is_roadmap={is_roadmap}
                save_callback={(syncFunction) => saveButtonHandler(syncFunction)}
                filter_callback={(syncFunction) => filterButtonHandler(syncFunction)}
                sort_callback={(syncFunction) => syncButtonHandler(syncFunction)}
                additional_callback={(syncFunction) => addButtonHandler(syncFunction)} />
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
                        event_users={event_data.users}
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
