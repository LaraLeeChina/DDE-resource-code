var error = (status, errorMessage) => {
    var response = {
      status: status,
      message: errorMessage
    };
    return response;
};

exports.error = error;