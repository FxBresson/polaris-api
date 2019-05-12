/*
Service definition
*/
const sendBodyError = (response, errorMessage) => {
    return response.status(400).json({
        message: errorMessage,
        err: null,
        data: null,
    });
}

const sendApiSuccessResponse = (response, successMessage, data) => {
    return response.status(200).json({
        message: successMessage,
        err: null,
        data: data,
    })
}

const sendUnauthorizedErrorResponse = (response, errorMessage, error) => {
    return response.status(401).json({
        message: errorMessage,
        error,
        data: null,
    })
}

const sendApiErrorResponse = (response, errorMessage, error) => {
    return response.status(500).json({
        message: errorMessage,
        error,
        data: null,
    });
}
// 


export {
    sendBodyError,
    sendApiSuccessResponse,
    sendUnauthorizedErrorResponse,
    sendApiErrorResponse,
};