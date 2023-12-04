import { Container } from '@mui/material'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { mainTool } from '../toolbar/tools'
import EventForm from './EventForm'

export default function EventCard(props) {
    const tab = useSelector(state => state.selected_card_tab)

    const getContent = useCallback(() => {
        let component = null
        
        switch (tab) {
            case mainTool.label:
                component = <EventForm event_data={props.data.event_data} is_edit={true} />
                break
        }

        return component
    }, [tab, props.data.event_data])

    return (
        <Container>
            {
                getContent()
            }
        </Container>
    )
}
