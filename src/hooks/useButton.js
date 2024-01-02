import { SvgIcon, Button, useTheme } from "@mui/material"
import { v4 as uuidV4 } from "uuid"
import { useNavigate } from "react-router-dom"

import Tool from "../components/toolbar/Tool"
import { deleteTool, unpinTool } from "../components/toolbar/tools"
import {
    cancelButton, deleteButton,
    excludeButton, signOutButton
} from "../components/buttons"

export default function useButton(isTool) {
    const theme = useTheme()

    const negativeTools = [deleteTool, unpinTool]
    const negativeButtons = [
        deleteButton, cancelButton,
        excludeButton, signOutButton
    ]

    const navigate = useNavigate()

    return isTool ? function (tool, custom_callback = null,
        additional_styles = {}, compareWith = null) {

        let component = null
        const callback = custom_callback === null ?
            () => {
                if (tool.route !== null) {
                    navigate(tool.route)
                }
            }
            :
            (event) => custom_callback(event)
        const isNegativeTool = negativeTools.includes(tool)
        const toolColor = isNegativeTool ?
            theme.palette.error.main
            :
            compareWith === tool.label ?
                theme.palette.action.main
                :
                theme.palette.secondary.main
        const hoverToolColor = isNegativeTool ?
            theme.palette.error.main : theme.palette.action.main

        const colors = {
            color: toolColor,
            ":hover": {
                color: hoverToolColor
            }
        }

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
        function (button, custom_callback = null,
            validation = null, additional_styles = {}) {

            let component = null
            const callback = custom_callback === null ?
                () => {
                    if (button.route !== null) {
                        navigate(button.route)
                    }
                }
                :
                (event) => custom_callback(event)
            const isNegativeButton = negativeButtons.includes(button)
            const buttonBackgroundColor = isNegativeButton ?
                theme.palette.error.main : theme.palette.secondary.main
            const buttonTextColor = theme.palette.primary.main
            const hoverButtonBackgroundColor = isNegativeButton ?
                theme.palette.error.main : theme.palette.action.main

            const colors = {
                backgroundColor: buttonBackgroundColor,
                color: buttonTextColor,
                ":hover": {
                    backgroundColor: hoverButtonBackgroundColor
                }
            }


            component = <Button key={`button_${uuidV4()}`}
                disableElevation
                disabled={validation !== null ? validation() : false}
                onClick={(event) => callback(event)}
                variant="contained"
                startIcon={button.icon === null ?
                    null : <SvgIcon inheritViewBox component={button.icon} />
                }
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