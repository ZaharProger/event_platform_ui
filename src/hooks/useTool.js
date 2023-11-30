import { useTheme } from "@mui/material"
import { deleteTool } from "../components/toolbar/tools"

export default function useTool() {
    const theme = useTheme()
    
    return function(tool) {
        const negativeTools= [deleteTool]
        const isNegativeTool = negativeTools.includes(tool)
        const toolColor = isNegativeTool? 
            theme.palette.error.main : theme.palette.secondary.main
        const hoverToolColor = isNegativeTool? 
            theme.palette.error.main : theme.palette.action.main

        return {
            color: toolColor,
            ":hover": {
                color: hoverToolColor
            }
        }
    }
}