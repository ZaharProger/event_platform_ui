import { Stack } from '@mui/material'
import React from 'react'

import {v4 as uuidV4} from "uuid"
import Tool from './Tool'

export default function Toolbar(props) {
    return (
        <Stack direction="row" spacing={3} sx={{margin: 10}}
            justifyContent="flex-start" alignItems="center">
                {
                    props.tools.map(tool => {
                        return <Tool key={`tool_${uuidV4()}`} data={tool} />
                    })
                }
        </Stack>
    )
}
