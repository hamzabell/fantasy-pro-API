export const createHeaders = () => ({
    headers: new Headers({
        'Content-Type': 'application/json'
    })
});
export const createBody = (data) => ({
    body: JSON.stringify(data),
});
