import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'


import App from './components/App.js'
import {Provider} from "react-redux"
import {defaultStore} from "./redux/store"
import defaultTheme from './theme'

const root = createRoot(document.getElementById('root'))
root.render(
    <Router>
        <Provider store={ defaultStore }>
            <ThemeProvider theme={defaultTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>,
        </Provider>
    </Router>
)