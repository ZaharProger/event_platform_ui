import { useState } from "react"

export default function useValidation(initFieldValue, regex) {
    const [fieldValue, setFieldValue] = useState(initFieldValue)
    const savedRegex = regex

    return {
        set: (newValue) => setFieldValue(newValue),
        validate: () => {
            return savedRegex.test(fieldValue)
        },
        get: () => {
            return fieldValue
        }
    }
}