import { Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import DefaultDocItem from '../doc/DefaultDocItem'
import { v4 as uuidV4 } from "uuid"
import NotFound from '../notFound/NotFound'
import DocFormHeader from '../doc/DocFormHeader'
import { backendEndpoints, host } from '../routes'
import useApi from '../../hooks/useApi'
import useRoute from '../../hooks/useRoute'
import UploadModal from '../modal/uploadModal/UploadModal'

export default function GroupDocForm(props) {
    const callApi = useApi()
    const navigate = useRoute()

    const fieldTypes = localStorage.getItem('field_types') !== null ?
        JSON.parse(localStorage.getItem('field_types'))
        :
        [{ label: '', value: '' }]

    const fields = [
        {
            id: 1,
            name: 'Название поля',
            value: '',
            field_type: 'text',
            is_fullwidth: true
        },
        {
            id: 2,
            name: 'Тип поля',
            value: 'text',
            field_type: 'select',
            is_fullwidth: false,
            select_values: fieldTypes
        },
    ]
    const fieldsIds = fields.map(field => `${field.id}`)

    const [isUploadModalOpened, setIsUploadModalOpened] = useState(false)

    const downloadButtonHandler = useCallback(() => {
        const docTemplate = props.data.doc_template
        const route = `${host}${backendEndpoints.templates}`
        const requestData = {
            doc_template: docTemplate,
            upload: false
        }

        callApi(route, 'POST', JSON.stringify(requestData), {
            'Content-Type': 'application/json'
        }, true).then(responseData => {
            if (responseData.status == 200) {
                const contentWrap = document.querySelector('#Content-wrap')

                const downloadRef = document.createElement('a')
                downloadRef.href = URL.createObjectURL(responseData.data)
                downloadRef.download = `doc.${docTemplate.split('.').pop()}`
                downloadRef.style.display = 'none'
                contentWrap.appendChild(downloadRef)

                downloadRef.click()
                URL.revokeObjectURL(downloadRef.href);
                contentWrap.removeChild(downloadRef)
            }
        })
    }, [props.data])

    const uploadButtonHandler = useCallback(() => {
        setIsUploadModalOpened(true)
    }, [])
    
    return (
        <Stack direction="column" spacing={2} justifyContent="center"
            alignItems="center">
            <DocFormHeader doc_data={{name: props.doc_name, is_table: false}}
                user={props.user}
                additional_value_callback={() => { }}
                is_roadmap={false}
                // save_callback={(syncFunction) => saveButtonHandler(syncFunction)}
                // additional_callback={(syncFunction) => addButtonHandler(syncFunction)}
                download_callback={() => downloadButtonHandler()}
                upload_callback={() => uploadButtonHandler()}
            />
            <Stack direction="row" spacing={4}
                justifyContent="center" alignItems="center"
                useFlexGap flexWrap="wrap">
                {
                    props.data.length != 0 ?
                        props.data.fields.map(item => {
                            return <DefaultDocItem key={`doc_field_${uuidV4()}`}
                                is_editable={true}
                                // delete_callback={(syncFunction) => {
                                //     deleteButtonHandler(fieldsIds, syncFunction)
                                // }}
                                data={{
                                    fields: fields.map(field => {
                                        return {
                                            ...field,
                                            value: field.id == 1 ?
                                                item.name
                                                :
                                                fieldTypes.find(fieldType => {
                                                    return fieldType.value == item.type
                                                }).value
                                        }
                                    }),
                                    ids: fieldsIds
                                }} />
                        })
                        :
                        <NotFound />
                }
            </Stack>
            <UploadModal is_opened={isUploadModalOpened}
                group_name={props.group_name}
                close_callback={() => setIsUploadModalOpened(false)} />
        </Stack>
    )
}
