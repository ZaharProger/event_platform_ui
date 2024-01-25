import { v4 as uuidV4 } from "uuid"
import { prepareDatetime } from '../utils'
import { TextField, Typography } from "@mui/material"

export default function useFields() {
    return function(fields, styles={}, editable=false) {
        return fields.map((field, i) => {
            let component
            
            if (field.is_date) {
                const datetimeEndLabel = <Typography variant="subtitle2"
                    fontSize="0.8em" color="secondary">
                    {
                        field.name
                    }
                </Typography>
                component = <TextField id={field.id} key={`field_${uuidV4()}`}
                    defaultValue={prepareDatetime(field.value, true)}
                    className="DocField"
                    disabled={!editable}
                    type="datetime-local"
                    helperText={datetimeEndLabel} variant="outlined"
                    color="secondary" sx={{ ...styles }} />
            }
            else {
                component = <TextField key={`field_${uuidV4()}`} id={field.id}
                    className="DocField"
                    defaultValue={field.value}
                    disabled={!editable}
                    fullWidth={field.is_fullwidth}
                    label={field.name} variant="outlined"
                    color="secondary" sx={{ ...styles }} />
            }
    
            return component
        })
    }
}