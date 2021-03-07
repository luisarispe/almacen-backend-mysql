const CategoriasProductos = require('./model')

exports.agregar = async (req, res, next) => {
  req.body.usuario = req.idUsuario
  const { nombre, usuario } = req.body

  try {
    // VALIDA SI YA EXISTE UNA CATEGORIA PARA EL USUARIO
    const existeCategoria = await CategoriasProductos.findOne({
      where: {
        nombre,
        id_usuario: usuario
      }
    })
    if (existeCategoria) {
      return res.status(500).json({
        ok: false,
        mensaje: 'La categoría ya esta registrada.'
      })
    }
    const categoria = CategoriasProductos.build({
      nombre,
      id_usuario: usuario
    })
    await categoria.save()

    return res.status(200).json({
      ok: true,
      mensaje: 'Categoria creada.',
      categoria
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.listar = async (req, res, next) => {
  try {
    const categorias = await CategoriasProductos.findAll({
      where: {
        id_usuario: req.idUsuario
      }
    })
    return res.status(200).json({
      ok: true,
      mensaje: 'Listado de Categorías.',
      categorias
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.actualizar = async (req, res, next) => {
  const { id } = req.params
  const { nombre } = req.body

  try {
    // VALIDAMOS QUE LA CATEGORIA EXISTA
    const existeCategoria = await CategoriasProductos.findOne({
      where: {
        id,
        id_usuario: req.idUsuario
      }
    })

    if (!existeCategoria) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe categoría.'
      })
    }

    const existeNombre = await CategoriasProductos.findOne({
      where: { nombre, id_usuario: req.idUsuario }
    })
    // VALIDAMOS QUE LA CATEGORIA SEA UNICA
    if (existeNombre && existeNombre.id !== Number(id)) {
      return res.status(500).json({
        ok: false,
        mensaje: 'La categoría ya esta registrada.'
      })
    }

    await CategoriasProductos.update(
      { nombre },
      {
        where: {
          id
        }
      }
    )
    return res.status(200).json({
      ok: true,
      mensaje: 'La categoría fue actualizada.'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.cambiarEstado = async (req, res, next) => {
  const { id } = req.params
  try {
    // VALIDAMOS QUE LA CATEGORIA EXISTA
    const existeCategoria = await CategoriasProductos.findOne({
      where: {
        id,
        id_usuario: req.idUsuario
      }
    })
    if (!existeCategoria) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe categoría.'
      })
    }

    const estado = existeCategoria.estado === 1 ? 0 : 1
    await CategoriasProductos.update(
      { estado },
      {
        where: {
          id
        }
      }
    )

    res.status(200).json({
      ok: true,
      mensaje: 'La categoría fue actualizada.'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
