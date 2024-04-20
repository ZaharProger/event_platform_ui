import React from 'react'
import { Stack } from "@mui/material"

import DocFormHeader from './DocFormHeader'

export default function TextDocForm(props) {
  return(
    <Stack direction="column" spacing={2} justifyContent="center"
      alignItems="center">
      <DocFormHeader />
    </Stack>
  )
}
