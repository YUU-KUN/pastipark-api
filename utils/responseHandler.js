export const responseData = (response, statusCode, values=null, message='Success') => {
    var data = {
        success: true,
        message: message,
        data: values,
    }

    response.status(statusCode).json(data);
    response.end();
}

export const responseMessage = (response, statusCode, message) => {
    var data = {
        success: true,
        message: message
    }

    response.status(statusCode).json(data);
    response.end();
}