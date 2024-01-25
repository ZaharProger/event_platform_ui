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
import { changeAssignationFlag, changeMoneyTotal } from "../../redux/actions"
import NotFound from "../notFound/NotFound"
import NestedTaskFormHeader from "../task/NestedTaskFormHeader"
import Money from "../money/Money"
import DefaultDocItem from "./DefaultDocItem"

export default function TableDocForm(props) {
    const { data: { event_data, user, doc_data }, is_roadmap, is_money, nested_task } = props

    const callApi = useApi()
    const dispatch = useDispatch()

    const [docFields, setDocFields] = useState(is_roadmap ?
        [...event_data.tasks] : [...doc_data.fields]
    )
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [deleteItemIds, setDeleteItemIds] = useState(Array())
    const [isFilterModalOpened, setIsFilterModalOpened] = useState(false)
    const [filterList, setFilterList] = useState({})
    const [isAscending, setIsAscending] = useState(true)

    const getActualDocData = useCallback((itemsToExclude = []) => {
        const className = is_roadmap ? 'Task' : 'DocField'
        let fieldForms = Array.from(document.getElementsByClassName(className))
        if (itemsToExclude.length != 0 && is_roadmap) {
            fieldForms = fieldForms.filter(fieldForm => !itemsToExclude.includes(fieldForm.id))
        }

        return fieldForms.map(fieldForm => {
            const updatedField = {}
            let fieldFormData

            if (is_roadmap) {
                const foundField = docFields.filter(docField => docField.id == fieldForm.id)
                updatedField.id = foundField[0].id
                updatedField.users = [...foundField[0].users]
                updatedField.parent = foundField[0].parent
                fieldFormData = fieldForm
                    .querySelector('.Task-info')
                    .querySelectorAll('input, textarea, select')
            }
            else {
                fieldFormData = fieldForm.querySelectorAll('input, textarea, select')
            }

            fieldFormData.forEach(input => {
                let formValue = input.value
                if (input.type.includes('datetime')) {
                    const timestamp = new Date(input.value).getTime() / 1000
                    if (!isNaN(timestamp) && timestamp !== '') {
                        formValue = timestamp
                    }
                    else {
                        formValue = null
                    }
                }

                if (is_roadmap) {
                    updatedField[input.id] = formValue
                }
                else {
                    updatedField.id = /^\d+$/.test(input.id) ? parseInt(input.id) : input.id
                    updatedField.value = itemsToExclude.includes(input.id) ? undefined : formValue
                }
            })

            return updatedField
        })
    }, [docFields, is_roadmap])

    const confirmButtonHandler = useCallback((syncFunction) => {
        const actualDocData = syncFunction(
            is_roadmap,
            getActualDocData(deleteItemIds),
            docFields,
            deleteItemIds
        )

        if (is_roadmap) {
            dispatch(changeAssignationFlag(false))
        }
        setDocFields(actualDocData)
        if (is_money) {
            dispatch(changeMoneyTotal(null))
        }
        setIsConfirmModalOpened(false)
    }, [docFields, deleteItemIds, is_roadmap, is_money])

    const deleteButtonHandler = useCallback((itemIds, syncFunction) => {
        setDocFields(syncFunction(is_roadmap, getActualDocData(), docFields))
        setDeleteItemIds(itemIds)
        setIsConfirmModalOpened(true)
    }, [is_roadmap, docFields])

    const saveButtonHandler = useCallback((syncFunction) => {
        const formData = {
            event_id: event_data.id,
            doc_id: doc_data.id,
            name: document.querySelector('#Doc-form-header').querySelector('input').value,
        }
        let route

        if (is_roadmap) {
            formData.tasks = syncFunction(is_roadmap, getActualDocData(), docFields)
            route = backendEndpoints.tasks
        }
        else {
            formData.fields = syncFunction(is_roadmap, getActualDocData(), docFields)
            route = backendEndpoints.docs
        }

        callApi(`${host}${route}`, 'PUT', JSON.stringify(formData), {
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
            dispatch(changeAssignationFlag(false))
            setFilterList({})
        }
        else {
            for (let i = 0; i < actualDocData.length; ++i) {
                actualDocData[i].values.push({
                    id: uuidV4(),
                    value: ''
                })
            }
        }

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
                                deleteButtonHandler([docField.id], syncFunction)
                            }} />
                    })
            }
            else {
                for (let i = 0; i < docFields[0].values.length; ++i) {
                    const dataGroup = []
                    for (let j = 0; j < docFields.length; ++j) {
                        dataGroup.push({
                            id: docFields[j].values[i].id,
                            name: docFields[j].name,
                            value: docFields[j].values[i].value,
                            field_type: docFields[j].field_type,
                            is_fullwidth: j == 0
                        })
                    }
                    data.push(dataGroup)
                }

                data = data.map(fields => {
                    const fieldsIds = fields.map(field => `${field.id}`)
                    return is_money ?
                        <Money key={`money_${uuidV4()}`}
                            is_editable={user.is_staff}
                            delete_callback={(syncFunction) => {
                                deleteButtonHandler(fieldsIds, syncFunction)
                            }}
                            data={{
                                fields,
                                ids: fieldsIds
                            }} />
                        :
                        <DefaultDocItem key={`money_${uuidV4()}`}
                            is_editable={user.is_staff}
                            delete_callback={(syncFunction) => {
                                deleteButtonHandler(fieldsIds, syncFunction)
                            }}
                            data={{
                                fields,
                                ids: fieldsIds
                            }} />
                })
            }
        }

        return <Stack direction="row" spacing={4}
            justifyContent="center" alignItems="center"
            useFlexGap flexWrap="wrap">
            {
                data.length != 0 ? data : <NotFound />
            }
        </Stack>
    }, [docFields, user, event_data, is_roadmap, is_money,
        isAscending, filterList, nested_task])

    const getTotal = useCallback((init = false) => {
        let total = 0

        if (init) {
            const priceFields = docFields.filter(docField => {
                const fieldName = docField.name.toLowerCase()
                return fieldName.includes('количество') ||
                    fieldName.includes('цена') || fieldName.includes('стоимость')
            })
            if (priceFields.length != 0) {
                for (let i = 0; i < priceFields[0].values.length; ++i) {
                    total += priceFields[0].values[i].value * priceFields[1].values[i].value
                }
            }
        }
        else {
            let numberFields = 0
            const amountPriceInputs = []
            document.querySelectorAll('.DocField').forEach(docField => {
                docField.querySelectorAll('input, textarea, select').forEach(input => {
                    if (input.type == 'number') {
                        ++numberFields
                        amountPriceInputs.push(input.value)
                        if (numberFields == 2) {
                            total += amountPriceInputs[0] * amountPriceInputs[1]
                            numberFields = 0
                            amountPriceInputs.splice(0, amountPriceInputs.length)
                        }
                    }
                })
            })
        }
        dispatch(changeMoneyTotal(false))

        return `ИТОГО: ${total}`
    }, [docFields])

    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            {
                nested_task !== null ?
                    <NestedTaskFormHeader task={docFields
                        .filter(docField => docField.id == nested_task.id)[0]
                    }
                        user={user}
                        close_callback={(syncFunction) => nestedTaskHandler(syncFunction)}
                        filter_callback={(syncFunction) => filterButtonHandler(syncFunction)}
                        sort_callback={(syncFunction) => sortButtonHandler(syncFunction)}
                        additional_callback={(syncFunction) => addButtonHandler(syncFunction)} />
                    :
                    <DocFormHeader doc_data={doc_data}
                        user={user}
                        additional_value_callback={is_money ? () => getTotal() : null}
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
                is_roadmap ?
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
