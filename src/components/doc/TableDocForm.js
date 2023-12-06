import React, { useCallback, useState } from 'react'
import DocFormHeader from './DocFormHeader'
import { Stack } from '@mui/material'

import { v4 as uuidV4 } from "uuid"
import Task from '../task/Task'

export default function TableDocForm(props) {
    const {event_data: {id, users, tasks}, doc_data, user} = props.data

    const docTypes = localStorage.getItem('doc_types') !== null?
        JSON.parse(localStorage.getItem('doc_types')) : []
    const roadMapDocType = docTypes.filter(docType => docType.label == 'Roadmap')

    const [docRecords, setDocRecords] = useState(() => {
        let initRecords = []
    
        if (roadMapDocType.length != 0) {
            if (doc_data.doc_type.toLowerCase().includes(roadMapDocType[0].value.toLowerCase())) {
                initRecords = [...tasks]
            }
            else {
                initRecords = [...doc_data.fields]
            }
        }

        return initRecords
    })

    const saveButtonHandler = useCallback(() => {
        console.log(1)
    }, [props])
    
    const addButtonHandler = useCallback(() => {
        setDocRecords([
            ...docRecords,
            null
        ])
    }, [props])

    return (
        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" width="100%">
            <DocFormHeader doc_data={doc_data} 
                user={user}
                save_callback={() => saveButtonHandler()}
                additional_callback={() => addButtonHandler()} />
            {
                roadMapDocType.length != 0?
                docRecords.map(docRecord => {
                    return <Task key={`task_${uuidV4()}`} task={docRecord} user={user} />
                })
                :
                null
            }
        </Stack>
    )
}
