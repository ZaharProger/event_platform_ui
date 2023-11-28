import { Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import {v4 as uuidV4} from "uuid"
import Tool from './Tool'

export default function Toolbar(props) {
    const navigate = useNavigate()

    return (
        <Stack direction="row" spacing={5} sx={{margin: '30px 50px 10px 30px'}} useFlexGap
            alignItems="center">
                {
                    props.tools.map(tool => {
                        return <Tool key={`tool_${uuidV4()}`} data={{
                            tool,
                            callback: () => {
                                if (tool.route !== null) {
                                    navigate(tool.route)
                                }
                            }
                        }}  />
                    })
                }
        </Stack>
    )
}
