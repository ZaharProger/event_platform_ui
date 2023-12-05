import { useTheme } from '@emotion/react'
import { Container, Stack, useMediaQuery } from '@mui/material'
import React from 'react'

export default function ContentListItem(props) {
    const theme = useTheme()
    const isMobile = useMediaQuery('(max-width: 1000px)')

    return (
        <Stack direction={isMobile? 'column' : 'row'} spacing={3} width="100%"
            justifyContent={isMobile? 'center' : 'space-between'} alignItems="center">
                <Container maxWidth="sm" sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '10px'
                }}>
                    {
                        props.data.item_info
                    }
                </Container>
                {
                    props.data.item_buttons
                }
        </Stack>
    )
}
