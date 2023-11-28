export default function useValidation(regex) {
    const savedRegex = regex
    return function(value) {
        return savedRegex.test(value)
    }
}