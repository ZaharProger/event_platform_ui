export default function useApi() {
    const requestTypes = ['GET', 'PUT', 'DELETE', 'POST', 'PATCH']
    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : '';
      }

    return async function (url, requestType, body, headers, isBlobResponse=false) {
        const method = requestType.toUpperCase()
        const settings = {
            method: requestTypes.includes(method)? method : requestTypes[0],
            credentials: 'include',
	        headers: {
	            'X-CSRFToken': getCookie('csrftoken')
	        }
        }
        if (body !== null) {
            settings.body = body
        }
        if (headers !== null) {
            settings.headers = {
	            ...settings.headers,
		        ...headers    
	        }
        }

        const response = await fetch(url, settings)
        const responseData = response.status != 500?
            isBlobResponse? await response.blob() : await response.json() : {}

        return {
            status: response.status,
            data: responseData
        }
    }
}