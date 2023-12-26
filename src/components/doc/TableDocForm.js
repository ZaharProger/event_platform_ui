import React, { useCallback, useState } from "react"
import { Stack } from "@mui/material"

import { v4 as uuidV4 } from "uuid"
import DocFormHeader from './DocFormHeader'
import ConfirmModal from '../confirmModal/ConfirmModal'
import Task from '../task/Task'
import { backendEndpoints, host } from "../routes"
import useApi from '../../hooks/useApi'

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
                    // const usersCollection = dataToSync !== null? dataToSync : assignedUsers
                    // const assignation = usersCollection.filter(assignation => {
                    //     return assignation.task == updatedField.id
                    // })
                    // if (assignation.length != 0) {
                    //     updatedField.users = assignation[0].users.map(assignedUser => {
                    //         const foundUser = users
                    //             .filter(eventUser => eventUser.user.id == assignedUser.user_id)[0]
                    //         return {
                    //             ...foundUser,
                    //             is_responsible: assignedUser.is_responsible
                    //         }
                    //     })
                    // }
                    // else {
                    //     updatedField.users = foundField[0].users
                    // }
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
    }, [])

    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            <DocFormHeader doc_data={doc_data} user={user}
                save_callback={() => saveButtonHandler()}
                additional_callback={() => addButtonHandler()} />
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
