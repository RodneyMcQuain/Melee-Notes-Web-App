//import history from './history';

export const handleResponse = (history: any, response: any) => {
    let responseStatus = response.status;

    if (responseStatus === 404) {
        history.push('/notFoundError');
        throw new Error("404");
    } else if (responseStatus >= 500) {
        history.push('/serverError');
        throw new Error(responseStatus);
    } else
        return response;
}