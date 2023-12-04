import { SvgIcon, Button } from "@mui/material"
import { v4 as uuidV4 } from "uuid"
import { useNavigate } from "react-router-dom"

import Tool from "../components/toolbar/Tool"
import useColors from './useColors'

export default function useButton(isTool) {
    const getColors = useColors(isTool)
    const navigate = useNavigate()

    return isTool? function (tool, custom_callback=null, additional_styles={}, compareWith=null) {
        let component = null
        const callback = custom_callback === null ?
            () => {
                if (tool.route !== null) {
                    navigate(tool.route)
                }
            }
            :
            () => custom_callback()
        const colors = getColors(tool, isTool, compareWith)

        const toolData = {
            ...tool,
            colors,
            callback,
            additional_styles
        }

        component = <Tool key={`tool_${uuidV4()}`} data={toolData} />

        return component
    }
    :
    function (button, custom_callback=null, validation=null, additional_styles={}) {
        let component = null
        const callback = custom_callback === null ?
            () => {
                if (button.route !== null) {
                    navigate(button.route)
                }
            }
            :
            () => custom_callback()
        const colors = getColors(button, isTool)


        component = <Button key={`button_${uuidV4()}`}
            disableElevation
            disabled={validation !== null? validation() : false}
            onClick={() => callback()}
            variant="contained" 
            startIcon={button.icon === null? null : <SvgIcon inheritViewBox component={button.icon} />}
            sx={{
                fontSize: '0.8em',
                padding: '8px 40px',
                transition: '0.3s ease-out',
                ...colors,
                ...additional_styles
            }}>
            {
                button.label
            }
        </Button>

        return component
    }
}