import React, { useCallback, useState } from 'react'
import DocFormHeader from './DocFormHeader'
import { Stack } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import Task from '../task/Task'
import { useSelector } from 'react-redux'

export default function TableDocForm(props) {
    const {event_data: {id, users, tasks}, doc_data, user} = props.data

    const docTypes = localStorage.getItem('doc_types') !== null?
        JSON.parse(localStorage.getItem('doc_types')) : []
    const roadMapDocType = docTypes.filter(docType => docType.label == 'Roadmap')

    const [docFields, setDocFields] = useState(() => {
        let initFields = []
    
        if (roadMapDocType.length != 0) {
            if (doc_data.doc_type.toLowerCase().includes(roadMapDocType[0].value.toLowerCase())) {
                initFields = [...tasks]
            }
            else {
                initFields = [...doc_data.fields]
            }
        }

        return initFields
    })

    const assignedUsers = useSelector(state => state.assigned_users)

    const getFormData = useCallback((itemToExclude=null) => {
        const className = roadMapDocType.length != 0? 'Task' : ''
        let fieldForms = Array.from(document.getElementsByClassName(className))
        if (itemToExclude !== null) {
            fieldForms = fieldForms.filter(fieldForm => fieldForm.id != itemToExclude)
        }
   
        return fieldForms.map((fieldForm, i) => {
            const updatedField = {}
            updatedField.id = docFields[i].id
            
            fieldForm.querySelectorAll('input, textarea, select').forEach(input => {
                let formValue = input.value

                if (input.id.includes('datetime')) {
                    let timestamp = (new Date(input.value).getTime() / 1000).toString()
                    if (timestamp != 'NaN' && timestamp != '') {
                        formValue = timestamp
                    }
                }

                updatedField[input.id] = formValue
                
                if (roadMapDocType.length != 0) {
                    const assignation = assignedUsers.filter(assignation => {
                        return assignation.task == updatedField.id
                    })
                    if (assignation.length != 0) {
                        updatedField.users = users.filter(eventUser => {
                            return assignation[0].users.includes(eventUser.user.id)
                        })
                    }
                    else {
                        updatedField.users = docFields[i].users
                    }
                }
            })

            return updatedField
        })
    }, [docFields, assignedUsers, roadMapDocType])

    const saveButtonHandler = useCallback(() => {
        console.log(1)
    }, [props])
    
    const addButtonHandler = useCallback(() => {
        const formData = getFormData()
        if (roadMapDocType.length != 0) {
            formData.push({
                id: uuidV4(),
                datetime_start: '',
                datetime_end: '',
                state: 'Не назначена',
                parent: null,
                name: '',
                users: [],
                is_created: true
            })
        }

        setDocFields(formData)
    }, [docFields, roadMapDocType])

    const deleteButtonHandler = useCallback((itemId) => {
        const formData = getFormData(itemId)
        setDocFields(formData)
    }, [docFields])

    const syncFields = useCallback(() => {
        const formData = getFormData()
        setDocFields(formData)
    }, [docFields])

    return (
        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" width="100%">
            <DocFormHeader doc_data={doc_data} 
                user={user}
                save_callback={() => saveButtonHandler()}
                additional_callback={() => addButtonHandler()} />
            {
                roadMapDocType.length != 0?
                    docFields.map(docField => {
                        const taskId = `task_${uuidV4()}`
                        const foundAssignation = assignedUsers.filter(assignation => {
                            return assignation.task == docField.id
                        })

                        let updatedDocField = {
                            ...docField
                        }
                        if (foundAssignation.length != 0) {
                            updatedDocField.users = users.filter(eventUser => {
                                return foundAssignation[0].users.includes(eventUser.user.id)
                            })
                        }

                        return <Task key={taskId} task={updatedDocField} 
                            user={user} 
                            event_users={users}
                            assigned_users={assignedUsers}
                            sync_callback={() => syncFields()}
                            delete_callback={(itemId) => deleteButtonHandler(itemId)} />
                    })
                    :
                    null
            }
        </Stack>
    )
}
