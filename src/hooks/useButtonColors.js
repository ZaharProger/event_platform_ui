import { useTheme } from "@mui/material"
import { unpinButton, deleteButton, cancelButton, 
    excludeButton, signOutButton } from "../components/contentList/buttons"
import { deleteTool } from "../components/toolbar/tools"

export default function useButtonColors() {
    return function(button) {
        const theme = useTheme()

        const negativeButtons = [
            deleteButton, unpinButton, cancelButton, 
            excludeButton, signOutButton, deleteTool
        ]
        const isNegativeButton = negativeButtons.includes(button)
        const buttonColor = isNegativeButton? theme.palette.error : theme.palette.secondary
        const hoverButtonColor = isNegativeButton? theme.palette.error : theme.palette.action

        return {
            backgroundColor: buttonColor,
            color: buttonColor,
            hover: {
                backgroundColor: hoverButtonColor,
                color: hoverButtonColor
            }
        }
    }
}