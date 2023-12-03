import { useTheme } from "@mui/material"
import {
    unpinButton, deleteButton, cancelButton,
    excludeButton, signOutButton
} from "../components/buttons"
import { deleteTool } from "../components/toolbar/tools"
import { useSelector } from "react-redux"

export default function useColors() {
    const selectedTab = useSelector(state => state.selected_card_tab)
    const theme = useTheme()

    return function (button, isTool = false) {
        const negativeTools = [deleteTool]
        const negativeButtons = [
            deleteButton, unpinButton, cancelButton,
            excludeButton, signOutButton
        ]

        let colors
        if (isTool) {
            const isNegativeTool = negativeTools.includes(button)
            const toolColor = isNegativeTool ?
                theme.palette.error.main 
                : 
                selectedTab === button.label?
                    theme.palette.action.main
                    :
                    theme.palette.secondary.main
            const hoverToolColor = isNegativeTool ?
                theme.palette.error.main : theme.palette.action.main

            colors = {
                color: toolColor,
                ":hover": {
                    color: hoverToolColor
                }
            }
        }
        else {
            const isNegativeButton = negativeButtons.includes(button)
            const buttonBackgroundColor = isNegativeButton ?
                theme.palette.error.main : theme.palette.secondary.main
            const buttonTextColor = theme.palette.primary.main
            const hoverButtonBackgroundColor = isNegativeButton ?
                theme.palette.error.main : theme.palette.action.main

            colors = {
                backgroundColor: buttonBackgroundColor,
                color: buttonTextColor,
                ":hover": {
                    backgroundColor: hoverButtonBackgroundColor
                }
            }
        }

        return colors
    }
}