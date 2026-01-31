const sendSuccess = (res, message, data = null, meta = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, message, errorCode = null, details = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
  };

  if (errorCode || details) {
    response.error = {};
    if (errorCode) response.error.code = errorCode;
    if (details) response.error.details = details;
  }

  return res.status(statusCode).json(response);
};

const sendPaginated = (res, message, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
