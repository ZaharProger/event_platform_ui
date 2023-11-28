import { Button, Checkbox, FormControlLabel, SvgIcon, Typography } from '@mui/material'
import React from 'react'

import { profileTool, toolTypes } from './tools'
import useTool from '../../hooks/useTool'

export default function Tool(props) {
    const getToolColors = useTool()

    const toolColors = getToolColors(props.data)
    const {tool: {label, icon, type}, callback} = props.data

    const checkBoxLabel = <Typography variant="subtitle2" 
    fontSize="0.8em" color="secondary">
        {label}
    </Typography>

    return (
        <div className="Tool" onClick={() => callback()} style={{
            marginLeft: props.data.tool === profileTool? 'auto' : 0
        }}>
            {
                type == toolTypes.checkbox?
                <FormControlLabel sx={{display: 'flex', alignItems: 'center'}} 
                control={<Checkbox sx={{
                    color: toolColors.color,
                    "&.Mui-checked": {
                        color: toolColors[':hover'].color,
                    }
                }}/>} label={checkBoxLabel} />
                :
                <Button sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.3s ease-out',
                    ...toolColors
                }}>
                    {
                        icon !== null?
                        <SvgIcon sx={{fontSize: '2em'}} 
                            component={icon} inheritViewBox />
                        :
                        null
                    }
                    {
                        label !== null?
                        <Typography variant="subtitle2" display="block" fontSize="0.8em">
                            {label}
                        </Typography>
                        :
                        null
                    }
                </Button>
            }
        </div>
    )
}
