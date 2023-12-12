import { red, green, orange, grey } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'


const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#0B1D57',
    },
    error: {
      main: red[500],
    },
    success: {
        main: green[500],
    },
    text: {
        main: '#000000',
        disabled: '#000000'
    },
    action: {
        main: orange[400]
    },
    info: {
        main: grey.A200
    }
  },
})

export default defaultTheme