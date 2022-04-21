const responseError = (res, message = 'Hable con el administrador.', code = 500) => {
  res.status(code).json({
    ok: false,
    msg: message
  })
}

module.exports = responseError
