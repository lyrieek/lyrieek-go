// const postPrefix = "/"
const postPrefix = "//localhost:1212/"

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
    fetch: _fetch
}
