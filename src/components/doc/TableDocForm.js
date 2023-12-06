import React, { useCallback, useState } from 'react'
import DocFormHeader from './DocFormHeader'
import { Stack } from '@mui/material'

export default function TableDocForm(props) {
    const {event_data: {id, users, tasks}, doc_data, user} = props.data

    const [docRecords, setDocRecords] = useState(() => {
        let initRecords = []
        const docTypes = localStorage.getItem('doc_types') !== null?
            JSON.parse(localStorage.getItem('doc_types')) : []
        
        if (docTypes.length != 0) {
            const roadMapDocType = docTypes.filter(docType => docType.label == 'Roadmap')
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
        setDocRecords()
    }, [props])

    return (
        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" width="100%">
            <DocFormHeader doc_data={doc_data} 
                save_callback={() => saveButtonHandler()}
                additional_callback={() => addButtonHandler()} />
            
        </Stack>
    )
}
