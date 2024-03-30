import { v4 as uuidV4 } from "uuid"
import { prepareDatetime } from '../utils'
import { TextField, Typography } from "@mui/material"

export default function useFields() {
    return function (fieldsData, styles = {}, editable = false, updateCallback = null) {
        return fieldsData.fields.map(field => {
            let component

            if (field.field_type == 'date') {
                const datetimeEndLabel = <Typography variant="subtitle2"
                    fontSize="0.8em" color="secondary">
                    {
                        field.name
                    }
                </Typography>
                component = <TextField id={`${field.id}`} key={`field_${uuidV4()}`}
                    defaultValue={prepareDatetime(field.value, true)}
                    className="DocField"
                    disabled={!editable}
                    type="datetime-local"
                    helperText={datetimeEndLabel} variant="outlined"
                    color="secondary" sx={{ ...styles }} />
            }
            else if (field.field_type == 'select') {
                component = <TextField id={`${field.id}`} key={`field_${uuidV4()}`}
                    className="DocField"
                    disabled={!editable}
                    select
                    variant="outlined"
                    color="secondary" 
                    sx={{ ...styles }}
                    label={field.name}
                    defaultValue={field.value}
                    SelectProps={{
                        native: true,
                    }}>
                    {
                        field.select_values.map((selectItem) => {
                            const { label, value } = selectItem
                            return <option key={label} value={value}>
                                {
                                    value
                                }
                            </option>
                        })
                    }
                </TextField>
            }
            else {
                component = <TextField id={field.id}
                    key={`field_${uuidV4()}`}
                    className="DocField"
                    onInput={() => {
                        if (updateCallback !== null && field.field_type == 'number') {
                            updateCallback(field)
                        }
                    }}
                    defaultValue={field.value}
                    disabled={!editable}
                    type={field.field_type}
                    fullWidth={field.is_fullwidth}
                    label={field.name} variant="outlined"
                    color="secondary" sx={{ ...styles }} />
            }

            return component
        })
    }
}