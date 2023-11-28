import { useTheme } from '@emotion/react'
import { Container, Stack } from '@mui/material'
import React from 'react'

export default function ContentListItem(props) {
    const theme = useTheme()

    return (
        <Stack direction="row" spacing={4}
            justifyContent="center" alignItems="center">
                <Container maxWidth="sm" sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '20 10',
                    backgroundColor: theme.pallete.secondary
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
