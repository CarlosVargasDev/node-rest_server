const express = require('express')
const Usuario = require('../models/usuario');
const app = express()
const bcrypt = require('bcrypt');
const _ = require('underscore');


//Peticiones
app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email img role estado google')
        .skip(desde) //Saltarse los primeros 5 registros
        .limit(limite) //Muestrame los primeros 5
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({}, (err, lenght) => {
                res.json({
                    ok: true,
                    lenght,
                    usuarios
                });
            });

        })

    //   res.send('Hello World')
    // res.json('Get Usuario')

})
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         "id_usuario": body
    //     })
    // }

})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /*
        delete req.body.password;
        delete req.body.google;
    */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            message: 'Usuario eliminado'
        });
    });

    /*
        Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!usuarioEliminado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                usuario: usuarioEliminado
            });
        });
    */



})

module.exports = app;