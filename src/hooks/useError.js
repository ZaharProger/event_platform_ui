import { useState } from "react";

export default function useError() {
    const [errorMessage, setErrorMessage] = useState(null)
    return {
        set: (newValue) => setErrorMessage(newValue),
        get: () => {
            return errorMessage
        }
    }
}