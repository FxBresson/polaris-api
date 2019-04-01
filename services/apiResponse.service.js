const apiResponse = (res, message) => {
    res.json({
        message: message
    })
}

export { apiResponse }