var app = require('./app_config.js');
var db = require('./db_config.js');
var validator = require('validator');

app.get('/', function(req, res){

	
	res.end('Servidor ON!');
});

app.get('/listaAll', function (req, res) {

    db.User.find({}, function (error, users) {

        if (error) {
            res.json({ error: "Não foi possivél retornar os usuários" });
        } else {
            res.json(users);
        }
    });
});

app.post('/users', function(req, res){
        var email = validator.trim(validator.escape(req.param('email')));
        var password = validator.trim(validator.escape(req.param('password')));
        db.User.findOne({'email': email, 'password': password}, function (error, users) {
 
	    if(error){
	    res.json({error:"Não foi possivél retornar os usuários"});
	    }else{
	    res.json(users);
	    }
    });
});

app.get('/users/:id', function(req, res){
    var id = validator.trim(validator.escape(req.param('id')));
	db.User.findById(id, function(error, user){
	if (error){
	res.json({error: "Não foi possivél retornar os usuário"})	
	}else{
	res.json(user);
	}
	
    });

	
});

app.post('/createusers', function (req, res) {
    var fullname = validator.trim(validator.escape(req.param('fullname')));
    var email = validator.trim(validator.escape(req.param('email')));
    var password = validator.trim(validator.escape(req.param('password')));



    new db.User({
        'fullname': fullname,
        'email': email,
        'password': password,
        created_at: new Date()
    }).save(function (error, user){
        if (error) {
            res.json({ error: 'Não foi possivel salvar o usuário'});
        } else {
            res.json(user);
        }
    });

});

app.put('/user', function (req, res) {
    var id = validator.trim(validator.escape(req.param('id')));
    var fullname = validator.trim(validator.escape(req.param('fullname')));
    var email = validator.trim(validator.escape(req.param('email')));
    var password = validator.trim(validator.escape(req.param('password')));



    db.User.findById(id, function (error, user) {

        if (fullname) {
            user.fullname = fullname;
        }

        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }

        user.save(function (error, user) {
            if (error) {
                res.json({ error: 'Não foi possivél salvar o usuário' });
            } else {
                res.json(user);
            }
        });
    
    });

});



app.delete('/users/:id', function(req, res){

        var id = validator.trim(validator.escape(req.param('id')));
	    db.User.findById(id, function(error, user){
	    if (error){
	        res.json({error: "Não foi possivél retornar os usuário"})	
	        }else{
	        user.remove(function(error){
		        if (!error){
		        res.json({response:'Usuário excluido com sucesso'});
	            }
	    });
	        }
	
    });

	//res.end('delete users'); 
});


//=======================================//====================== Taxas e Bancos =============//================================//=====================

app.get('/taxas', function (req, res) {

    db.Taxa.find({}, function (error, taxa) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as taxas -> "+error });
        } else {
            res.json(taxa);
        }
    });
});

app.get('/taxas/:id', function (req, res) {
    var id = validator.trim(validator.escape(req.param('id')));
    db.Taxa.findById(id, function (error, taxa) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as taxas" })
        } else {
            res.json(taxa);
        }

    });

});


app.post('/taxas', function (req, res) {
    var fullname = validator.trim(validator.escape(req.param('fullname')));
    var valortaxa = validator.trim(validator.escape(req.param('valortaxa')));


    new db.Taxa({
        'fullname': fullname,
        'valortaxa': valortaxa,
        created_at: new Date()
    }).save(function (error, taxa) {
        if (error) {
            res.json({ error: 'Não foi possivel salvar a taxa' });
        } else {
            res.json(taxa);
        }
    });

});

app.put('/taxa', function (req, res) {
    var id = validator.trim(validator.escape(req.param('id')));
    var fullname = validator.trim(validator.escape(req.param('fullname')));
    var valortaxa = validator.trim(validator.escape(req.param('valortaxa')));


    db.Taxa.findById(id, function (error, taxa) {

        if (fullname) {
            taxa.fullname = fullname;
        }

        if (valortaxa) {
            taxa.valortaxa = valortaxa;
        }


        taxa.save(function (error, taxa) {
            if (error) {
                res.json({ error: 'Não foi possivél salvar a taxa' });
            } else {
                res.json(taxa);
            }
        });

    });

});


app.delete('/taxas/:id', function (req, res) {

    var id = validator.trim(validator.escape(req.param('id')));
    db.Taxa.findById(id, function (error, taxa) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as taxas" })
        } else {
            taxa.remove(function (error) {
                if (!error) {
                    res.json({ response: 'Taxa excluido com sucesso' });
                }
            });
        }

    });

   // res.end('delete taxa');
});


app.post('/calculaParcela', function (req, res) {

    var iddivida = validator.trim(validator.escape(req.param('iddivida')));
    var objdivida = {};
    var bancos = [];
    db.Divida.findById(iddivida, function (error, divida) {
        console.dir(divida);

        var valorFinanciado = divida.valortotal;
        var valorParcela = divida.valorparcela;
        var qtdParcela = divida.qntparcela;
        var priceI2 = .00001;
        var priceTeste = valorFinanciado * (((priceI2 / 100) * (Math.pow((1 + priceI2 / 100), qtdParcela))) / (Math.pow((1 + priceI2 / 100), qtdParcela) - 1));
        for (priceI2 == .00001; valorParcela > priceTeste; priceI2 = priceI2 + .00001) { priceTeste = valorFinanciado * (((priceI2 / 100) * (Math.pow((1 + priceI2 / 100), qtdParcela))) / (Math.pow((1 + priceI2 / 100), qtdParcela) - 1)); }
        var priceTaxa = priceI2 - .00001;
        priceTaxa = Math.round(priceTaxa * 10000) / 10000;
        db.Taxa.find({ valortaxa: { $lt: priceTaxa } }, function (error, taxa) {
            for (i = 0; i < taxa.length; i++) {

                var calcCF = (taxa[i].valortaxa / 100) / (1 - Math.pow(1 + (taxa[i].valortaxa / 100), -divida.qntparcela)); //calc CF
                var valorParcela = divida.valortotal * calcCF; //valor por parcela
                var t = {
                    _id: taxa[i]._id,
                    fullname: taxa[i].fullname,
                    valortaxa: taxa[i].valortaxa,
                    novovalorparcela: valorParcela

                };
                  
                bancos.push(t);
            }
            res.json(bancos);
        });
    });

        
});

//=======================================//=============== Dividas =============//========================//=========================

app.post('/createdivida', function (req, res) {
    var valorparcela = validator.trim(validator.escape(req.param('valorparcela')));
    var qntparcela = validator.trim(validator.escape(req.param('qntparcela')));
    var qntparcelapaga = validator.trim(validator.escape(req.param('qntparcelapaga')));
    var valortotal = validator.trim(validator.escape(req.param('valortotal')));
    var bancoorigem = validator.trim(validator.escape(req.param('bancoorigem')));
    var idusuario = validator.trim(validator.escape(req.param('idusuario')));



    new db.Divida({
        'valorparcela': valorparcela,
        'qntparcela': qntparcela,
        'qntparcelapaga': qntparcelapaga,
        'valortotal': valortotal,
        'bancoorigem': bancoorigem,
        'idusuario': idusuario,
        created_at: new Date()
    }).save(function (error, divida) {
        if (error) {
            res.json({ error: 'Não foi possivel salvar a divida'});
        } else {
            res.json(divida);
            }
        });

});

app.get('/dividas', function (req, res) {

    db.Divida.find({}, function (error, divida) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as taxas" });
        } else {
            res.json(divida);
        }
    });
});


app.get('/dividas/:id', function (req, res) {
    var id = validator.trim(validator.escape(req.param('id')));
    db.Divida.findById(id, function (error, divida) {
        if (error) {
            res.json({ error: "Não foi possivél retornar Divida" })
        } else {
            res.json(divida);
        }

    });

});

app.delete('/taxas/:id', function (req, res) {

    var id = validator.trim(validator.escape(req.param('id')));
    db.Divida.findById(id, function (error, divida) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as Dividas" })
        } else {
            divida.remove(function (error) {
                if (!error) {
                    res.json({ response: 'Divida excluido com sucesso' });
                }
            });
        }

    });

   // res.end('delete taxa');
});


//=======================================//=============== Portabilidade =============//========================//=========================


app.post('/createportabilidade', function (req, res) {

    var novovalorparcela = validator.trim(validator.escape(req.param('novovalorparcela')));
    var iddivida = validator.trim(validator.escape(req.param('iddivida')));
    var idtaxa = validator.trim(validator.escape(req.param('idtaxa')));
    var idusuario = validator.trim(validator.escape(req.param('idusuario')));
    var blockchain = validator.trim(validator.escape(req.param('blockchain')));
    var status = validator.trim(validator.escape(req.param('status')));
    
    new db.Portabilidade({
        'novovalorparcela': novovalorparcela,
        'iddivida': iddivida,
        'idtaxa': idtaxa,
        'idusuario': idusuario,
        'blockchain': blockchain,
        'status': status,
        created_at: new Date()
    }).save(function (error, portabilidade) {
        if (error) {
            res.json({ error: 'Não foi possivel salvar a portabilidade' });
        } else {
            res.json(portabilidade);
        }
    });

});

app.get('/portabilidades', function (req, res) {

    db.Portabilidade.find({}, function (error, portabilidade) {
        if (error) {
            res.json({ error: "Não foi possivél retornar as portabilidades" });
        } else {
            res.json(portabilidade);
        }
    });
});

app.post('/portabilidadesbyid', function (req, res) {

    var idusuario = validator.trim(validator.escape(req.param('idusuario')));

    db.Portabilidade.find({ idusuario: idusuario }, function (error, portabilidade) {
        if (error) {
            res.json({ error: "Não foi possivél retornar o usuário" });
        } else {
            res.json(portabilidade);
        }
    });
});


app.post('/alteraportabilidade', function (req, res) {

    var idusuario = validator.trim(validator.escape(req.param('idusuario')));

    db.Portabilidade.find({ idusuario: idusuario }, function (error, portabilidade) {
        if (error) {
            res.json({ error: "Não foi possivél retornar o usuário" });
        } else {
            res.json(portabilidade);
        }
    });
});

app.put('/alteraportabilidade', function (req, res) {
    var _id = validator.trim(validator.escape(req.param('_id')));
    var status = validator.trim(validator.escape(req.param('status')));
    var blockchain = validator.trim(validator.escape(req.param('blockchain')));

    db.Portabilidade.findById({ _id: _id }, function (error, portabilidade) {


        if (status) {
            portabilidade.status = status;
        }

        if (blockchain) {
            portabilidade.blockchain = blockchain;
        }


        portabilidade.save(function (error, portabilidade) {
            if (error) {
                res.json({ error: 'Não foi possivél alterar o Status e Portabilidade' });
            } else {
                res.json(portabilidade);
            }
        });

    });

});