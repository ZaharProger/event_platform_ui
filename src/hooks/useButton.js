import { useTheme } from "@mui/material"
import { unpinButton, deleteButton, cancelButton, 
    excludeButton, signOutButton } from "../components/buttons"

export default function useButton() {
    const theme = useTheme()
    return function(button) {
        const negativeButtons = [
            deleteButton, unpinButton, cancelButton, 
            excludeButton, signOutButton
        ]
        const isNegativeButton = negativeButtons.includes(button)
        const buttonBackgroundColor = isNegativeButton? 
            theme.palette.error.main : theme.palette.secondary.main
        const buttonTextColor = theme.palette.primary.main
        const hoverButtonBackgroundColor = isNegativeButton? 
            theme.palette.error.main : theme.palette.action.main

        return {
            backgroundColor: buttonBackgroundColor,
            color: buttonTextColor,
            ":hover": {
                backgroundColor: hoverButtonBackgroundColor
            }
        }
    }
}