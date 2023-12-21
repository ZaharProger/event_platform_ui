import React, { useCallback, useState } from 'react'
import DocFormHeader from './DocFormHeader'
import { Stack } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import Task from '../task/Task'
import { useSelector } from 'react-redux'
import useApi from '../../hooks/useApi'
import { backendEndpoints, host } from '../routes'

export default function TableDocForm(props) {
    const {event_data: {id, users, tasks}, doc_data, user} = props.data

    const callApi = useApi()

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

    const getFormData = useCallback((dataToSync=null, itemToExclude=null) => {
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
                    const usersCollection = dataToSync !== null? dataToSync : assignedUsers
                    const assignation = usersCollection.filter(assignation => {
                        return assignation.task == updatedField.id
                    })
                    if (assignation.length != 0) {
                        updatedField.users = assignation[0].users.map(assignedUser => {
                            const foundUser = users
                                .filter(eventUser => eventUser.user.id == assignedUser.user_id)[0]
                            return {
                                ...foundUser,
                                is_responsible: assignedUser.is_responsible
                            }
                        })
                    }
                    else {
                        updatedField.users = docFields[i].users
                    }
                    
                    updatedField.parent = null
                }
            })

            return updatedField
        })
    }, [docFields, assignedUsers, roadMapDocType])

    const saveButtonHandler = useCallback(() => {
        const formData = {
            event_id: id,
            doc_id: doc_data.id,
            name: document.querySelector('#Doc-form-header').querySelector('input').value,
            tasks: getFormData()
        }
        
        callApi(`${host}${backendEndpoints.tasks}`, 'PUT', JSON.stringify(formData), {
            'Content-Type': 'application/json'
        }).then(responseData => {
            if (responseData.status == 200) {
                window.location.reload()
            }
        })

    }, [docFields, id])
    
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
            })
        }

        setDocFields(formData)
    }, [docFields, roadMapDocType])

    const deleteButtonHandler = useCallback((itemId) => {
        const formData = getFormData(null, itemId)
        setDocFields(formData)
    }, [docFields])

    const syncFields = useCallback((dataToSync) => {
        const formData = getFormData(dataToSync)
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
                    <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap"
                        justifyContent="center" alignItems="center">
                        {
                            docFields.map(docField => {
                                const taskId = `task_${uuidV4()}`
                                let updatedDocField = {
                                    ...docField
                                }

                                return <Task key={taskId} task={updatedDocField} 
                                    user={user} 
                                    fields={docFields}
                                    users={users}
                                    assigned_users={assignedUsers}
                                    sync_callback={(dataToSync) => syncFields(dataToSync)}
                                    delete_callback={(itemId) => deleteButtonHandler(itemId)} />
                            })
                        }
                    </Stack>
                    :
                    null
            }
        </Stack>
    )
}
