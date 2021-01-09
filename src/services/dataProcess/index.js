// const postPrefix = "/"
const postPrefix = "//localhost:1234/"

const _fetch = (url, data, successFn) => {
    if (typeof data === 'function') {
        successFn = data;
        data = null;
    }
	return fetch(postPrefix + url, {
        method: 'POST',
		body: JSON.stringify(data),
        mode: 'cors',
        cache: 'no-cache'
	}).then(successFn && ((e) => {
        e.json().then(successFn)
    }))
}
export default {
	pull(e) {
		_fetch('chressData', e)
	}
}
