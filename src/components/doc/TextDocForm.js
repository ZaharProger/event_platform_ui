import React, { useCallback } from 'react'
import { Stack } from "@mui/material"

import { v4 as uuidV4 } from "uuid"
import DocFormHeader from './DocFormHeader'
import DefaultDocItem from './DefaultDocItem'

export default function TextDocForm(props) {
  const { data: { doc_data, user } } = props

  const getFieldsData = useCallback(() => {
    const fieldsData = []

    for (let i = 0; i < doc_data.fields[0].values.length; ++i) {
      const dataGroup = []
      for (let j = 0; j < doc_data.fields.length; ++j) {
        const dataGroupItem = {
          id: doc_data.fields[j].values[i].id,
          name: doc_data.fields[j].name,
          value: doc_data.fields[j].values[i].value,
          field_type: doc_data.fields[j].field_type,
          is_fullwidth: j <= doc_data.fields.length - 2
        }
        if (dataGroupItem.field_type == 'select') {
          const selectValues = localStorage.getItem('field_types') !== null ?
            JSON.parse(localStorage.getItem('field_types'))
            :
            [{ label: '', value: '' }]
          dataGroupItem.select_values = selectValues
        }
        dataGroup.push(dataGroupItem)
      }
      fieldsData.push(dataGroup)
    }

    return fieldsData.map(fields => {
      const fieldsIds = fields.map(field => `${field.id}`)
      return <DefaultDocItem key={`field_${uuidV4()}`}
        is_table={false}
        is_editable={user.is_staff}
        data={{
          fields,
          ids: fieldsIds
        }} />
    })
  }, [doc_data, user])

  return (
    <Stack direction="column" spacing={2} justifyContent="center"
      alignItems="center">
      <DocFormHeader doc_data={doc_data}
        user={user}
        save_callback={() => { }}
        additional_value_callback={() => { }}
        has_template={false}
        is_roadmap={false} />
      {
        getFieldsData()
      }
    </Stack>
  )
}
