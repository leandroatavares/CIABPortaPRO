
//Local
//var db_string = 'mongodb://127.0.0.1/projetociab';

//Web -> mongodb://dbciab:IOfQHzcLOsQ9YFy4FoEX6LvFk6Zby9QMIIpz7ysQmoD5ezGBIwIrxBiC5WSjWfASqppqfCOdzqDHWYn1mSsIsg ==@dbciab.documents.azure.com: 10255 /?ssl = true & replicaSet=globaldb

//var db_string = 'mongodb://dbciab:IOfQHzcLOsQ9YFy4FoEX6LvFk6Zby9QMIIpz7ysQmoD5ezGBIwIrxBiC5WSjWfASqppqfCOdzqDHWYn1mSsIsg==@dbciab.documents.azure.com:10255/?ssl=true';

var db_string = 'mongodb://dbciab2:yO2MPSPDmYTrcIdmhE1S6Vt2BKOxu4INs3hsxB5aEMigRaJLPdGKLe44wEszdLShsWwPGJudBccsFY9IbIX5Mw==@dbciab2.documents.azure.com:10255/?ssl=true';

var mongoose = require('mongoose').connect(db_string);

var db = mongoose.connection;

var User;
var Taxa;
var Divida;
var Portabilidade;

db.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

db.once('open', function () {

    var userSchema = mongoose.Schema({
        fullname: String,
        email: String,
        password: String,
        created_at: Date
    });
    exports.User = mongoose.model('User', userSchema);


    var taxaSchema = mongoose.Schema({
        fullname: String,
        valortaxa: String,
        //base64: String,
        created_at: Date
    });
    exports.Taxa = mongoose.model('Taxa', taxaSchema);

    var dividaSchema = mongoose.Schema({
        valorparcela : String,
        qntparcela : String,
        qntparcelapaga : String,
        valortotal : String,
        bancoorigem: String,
        idusuario  : String,
        created_at: Date
    });
    exports.Divida = mongoose.model('Divida', dividaSchema);

    var portabilidadeSchema = mongoose.Schema({
        novovalorparcela: String,
        iddivida: String,
        idtaxa: String,
        idusuario: String,
        blockchain: String,
        status: String,
        created_at: Date
    });
    exports.Portabilidade = mongoose.model('Portabilidade', portabilidadeSchema);

    

});