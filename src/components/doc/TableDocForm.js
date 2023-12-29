import React, { useCallback, useState } from "react"
import { Stack, Typography } from "@mui/material"

import { v4 as uuidV4 } from "uuid"
import DocFormHeader from './DocFormHeader'
import ConfirmModal from '../confirmModal/ConfirmModal'
import Task from '../task/Task'
import { backendEndpoints, host } from "../routes"
import useApi from '../../hooks/useApi'
import Notification from "../notification/Notification"

export default function TableDocForm(props) {
    const { data: { event_data, user, doc_data }, is_roadmap } = props

    const callApi = useApi()

    const [docFields, setDocFields] = useState(is_roadmap ?
        [...event_data.tasks] : [...doc_data.fields]
    )
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState(-1)

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
                    let timestamp = (new Date(input.value).getTime() / 1000).toString()
                    if (timestamp != 'NaN' && timestamp != '') {
                        formValue = timestamp
                    }
                }

                updatedField[input.id] = formValue

                if (is_roadmap) {
                    updatedField.users = foundField[0].users
                    updatedField.nested_tasks = []
                }
            })

            return updatedField
        })
    }, [docFields, is_roadmap])

    const confirmButtonHandler = useCallback(() => {
        const actualDocData = getActualDocData(deleteItemId)
        setDocFields(actualDocData)
        setIsConfirmModalOpened(false)
    }, [docFields, deleteItemId])

    const saveButtonHandler = useCallback(() => {
        const formData = {
            event_id: event_data.id,
            doc_id: doc_data.id,
            name: document.querySelector('#Doc-form-header').querySelector('input').value,
            tasks: getActualDocData()
        }

        callApi(`${host}${backendEndpoints.tasks}`, 'PUT', JSON.stringify(formData), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                window.location.reload()
            }
        })

    }, [docFields, event_data, doc_data])

    const addButtonHandler = useCallback(() => {
        const actualDocData = getActualDocData()
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

        setDocFields(actualDocData)
    }, [is_roadmap])

    const getOverwork = useCallback(() => {
        let overworkData = {}

        docFields.forEach(docField => {
            docField.users.forEach(taskUser => {
                const dictKey = `${taskUser.user.name}`
                const hasKey = overworkData[dictKey] !== undefined

                const relatedTasksAmount = docFields.reduce((prevTasksAmount, docItem) => {
                    return prevTasksAmount + docItem.users
                        .filter(itemUser => itemUser.user.id == taskUser.user.id)
                        .length
                }, 0)

                if (overworkData[dictKey] < relatedTasksAmount || !hasKey) {
                    overworkData[dictKey] = relatedTasksAmount
                }
            })
        })

        overworkData = Object.entries(overworkData).filter(([_, tasksAmount]) => {
            return tasksAmount / docFields.length >= 0.7
        })

        let overworkComponent = null
        if (overworkData.length != 0) {
            const notificationHeader = 'Устраните переработку среди участников организационного комитета:'
            overworkComponent = <Notification header={notificationHeader} color={'error'} data={
                overworkData
                    .map(([username, tasksAmount]) => {
                        const overworkStat = `${tasksAmount} из ${docFields.length}`
                        return <Typography key={`overwork_user_${uuidV4()}`} variant="subtitle1"
                            color="error" marginRight="auto!important" fontSize="0.9em">
                            {
                                `${username} задействован в ${overworkStat} задач`
                            }
                        </Typography>
                    })
            } />
        }

        return overworkComponent
    }, [docFields])

    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            <DocFormHeader doc_data={doc_data} user={user}
                save_callback={() => saveButtonHandler()}
                additional_callback={() => addButtonHandler()} />
            {
                is_roadmap ?
                    getOverwork()
                    :
                    null
            }
            <Stack direction="row" spacing={4}
                justifyContent="center" alignItems="center"
                useFlexGap flexWrap="wrap">
                {
                    docFields.map(docField => {
                        const fieldId = `${is_roadmap ? 'task' : 'field'}_${uuidV4()}`
                        return is_roadmap ?
                            <Task key={fieldId} task={{ ...docField }}
                                user={user}
                                event_tasks={docFields}
                                event_users={event_data.users}
                                sync_callback={() => setDocFields(getActualDocData())}
                                update_callback={(newData) => setDocFields(newData)}
                                delete_callback={() => {
                                    setDeleteItemId(docField.id)
                                    setIsConfirmModalOpened(true)
                                }} />
                            :
                            null
                    }
                    )
                }
            </Stack>
            <ConfirmModal is_opened={isConfirmModalOpened}
                close_callback={() => setIsConfirmModalOpened(false)}
                confirm_callback={() => confirmButtonHandler()}
                modal_header={`Удаление ${is_roadmap ? 'задачи' : 'записи'}`}
                modal_content={
                    `Вы действительно хотите удалить эту ${is_roadmap ? 'задачу' : 'запись'}?`
                } />
        </Stack>
    )
}
