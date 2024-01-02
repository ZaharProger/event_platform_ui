import { useTheme } from "@mui/material"

export default function useTextFieldStyles(type, editable=true) {
    const theme = useTheme()

    const types = ['outlined', 'underline']
    let componentStyles = {}

    if (types.includes(type.toLowerCase())) {
        switch (type.toLowerCase()) {
            case 'outlined':
                componentStyles = {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: editable ? theme.palette.primary.main : 'transparent',
                        '& fieldset': {
                            borderColor: theme.palette.secondary.main,
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.secondary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.action.main,
                        }
                    }
                }
                break
            case 'underline':
                componentStyles = {
                    "& label.Mui-focused": {
                        color: `${theme.palette.secondary.main}!important`
                    },
                    "& .MuiInput-underline:before": {
                        borderBottomColor: `${theme.palette.secondary.main}!important`
                    },
                    "& .MuiInput-underline::after": {
                        borderBottomColor: `${theme.palette.action.main}!important`
                    },
                    "& .MuiInput-underline:hover:before": {
                        borderBottomColor: `${theme.palette.secondary.main}!important`
                    }
                }
                break
        }
    }

    return componentStyles
}