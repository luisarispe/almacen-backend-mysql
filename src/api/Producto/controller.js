const Productos = require('./model')
const Usuarios = require('../Usuario/model')
const CategoriasProductos = require('../CategoriaProducto/model')
exports.agregar = async (req, res, next) => {
  req.body.usuario = req.idUsuario
  const { nombre, cantidad, precio, idCategoria, usuario } = req.body

  try {
    const existeProducto = await Productos.findOne({
      where: {
        nombre,
        id_usuario: usuario
      }
    })

    // VALIDAMOS SI EXITE YA EL PRODUCTO PARA EL USUARIO
    if (existeProducto) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El producto ya existe.'
      })
    }

    const producto = Productos.build({
      nombre,
      cantidad,
      precio,
      id_categoria: idCategoria,
      id_usuario: usuario
    })

    await producto.save()

    return res.status(200).json({
      ok: true,
      mensaje: 'Producto creado.',
      producto
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
    const productos = await Productos.findAll({
      where: { id_usuario: req.idUsuario },
      include: [
        {
          model: Usuarios,
          required: true,
          attributes: ['nombre']
        },
        {
          model: CategoriasProductos,
          required: true,
          attributes: ['nombre']
        }
      ]
    })
    return res.status(200).json({
      ok: true,
      mensaje: 'Listado de Productos',
      productos
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador'
    })
  }
}
exports.actualizar = async (req, res, next) => {
  const { id } = req.params
  const { nombre, cantidad, precio, idCategoria } = req.body

  try {
    const existeProducto = await Productos.findOne({
      where: {
        id,
        estado: 1,
        id_usuario: req.idUsuario
      }
    })
    if (!existeProducto) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe producto.'
      })
    }

    const existeNombre = await Productos.findOne({
      where: {
        nombre, id_usuario: req.idUsuario
      }
    })

    if (existeNombre && existeNombre.id !== Number(id)) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El producto ya esta registrado'
      })
    }
    await Productos.update(
      { nombre, cantidad, precio, id_categoria: idCategoria },
      {
        where: {
          id
        }
      }
    )
    return res.status(200).json({
      ok: true,
      mensaje: 'El producto fue actualizado.'
    })
  } catch (error) {
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
    const existeProducto = await Productos.findOne({
      where: {
        id,
        id_usuario: req.idUsuario
      }
    })
    if (!existeProducto) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe producto.'
      })
    }

    const estado = existeProducto.estado === 1 ? 0 : 1
    await Productos.update(
      { estado },
      {
        where: {
          id
        }
      }
    )

    res.status(200).json({
      ok: true,
      mensaje: 'El producto fue actualizado.'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
