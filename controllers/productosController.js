const db = require('../database/models');
const Sequelize = require('sequelize');
const { log } = require('debug');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const op = db.Sequelize.Op;

module.exports = {
    detalle: function (req,res) {
        let id = req.params.id;
        db.Producto.findByPk(id, {
           include: [{all: true, nested: true}]
        })
        .then(function (unProducto) {
            res.render('detalle',{ unProducto: unProducto, title: unProducto.nombre })
        })
    },

    porCategoria: function (req,res) {
        let categoria = req.params.laCategoria;
        db.Producto.findAll({
            where: {
                categoria_id: categoria
            },
            include: [{
                association: 'categorias'
            }]
        })  
        .then(function (resultado) {
            res.render('porCategoria', { resultado: resultado, title: resultado[0].categorias.nombre })
        })
    },

    buscar: function (req,res) {{

           let resultado = req.query.busqueda.toLowerCase().trim()
            db.Producto.findAll({
                where: {
                    [op.or] : [
                        {nombre : {[op.substring] : resultado}}, 
                    ]
                }
            })
            .then((resultados) => {
                        res.render('resultadoBusqueda', {
                            title: "Busqueda",
                            resultados,
                            busqueda: req.query.busqueda,
                            toThousand,
                            session: req.session
                        })
    
                    })        
            .catch(error => console.log(error))
         
                
        }
    },

    agregarComentario: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let idProducto = req.params.id;
        let idUsuario = req.session.usuarioLogueado.id;

        db.Comentario.create({
            texto_comentario: req.body.texto_comentario,
            calificacion: req.body.calificacion,
            usuario_id: idUsuario,
            producto_id: idProducto
        })
        .then(function () {
            res.redirect('/productos/detalle/'+idProducto)
        })
    },

    agregarProducto: function (req, res){
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        res.render('agregarProducto', { title: 'Agregar Producto'});
    },

    productoSubmit: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        db.Producto.create({
           ...req.body,
           /* image:req.file ? req.file.filename : "default-image.png",*/
        })
        .then(() => {
            res.redirect('/')
        })
        .catch(error => console.log(error))
       

    },

    misProductos: function (req, res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }

        db.Producto.findAll(
            {
            where: {usuario_id: req.session.usuarioLogueado.id},
            order: [['updatedAt', 'DESC']]
        }
        )
        .then(function (productos) {
            res.render('misProductos', {productos: productos, title: 'Mis productos'})
        })
        .catch((error) => res.send(error))
    },

    editarProducto: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
        .then(function (producto) {
            res.render('editarProducto', {producto: producto, title: 'Editar producto'})
        })
    },

    editarConfirm: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }

        let id = req.params.id;
        db.Producto.update(req.body,
            {
                where: {
                    id:id
                }
            })
        .then(function (output) {
            res.redirect('/productos/misProductos')
        })
    },

    borrarProducto: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
            .then(function (producto) {
                res.render('borrarProducto', { producto: producto, title: 'Borrar producto' })
            })
    },

    borrarConfirm: function (req,res) {
        if (req.session.usuarioLogueado == undefined) {
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.destroy({
            where: {
                id: id
            }
        })
        .then(function (otuput) {
            res.redirect('/productos/misProductos')
        })
    }
}