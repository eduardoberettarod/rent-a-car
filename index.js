const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//necessario para permitir requisições de diferentes origens (dominios/servidores)
const cors = require('cors')
app.use(cors())

app.use(express.json())

app.get('/', function (req, res) {
    res.send('Locadora de veículos')
})

let mysql = require('mysql')
let conexao = mysql.createConnection({
    host: "10.125.44.41",
    user: "root",
    password: "",
    database: "bd_locadora"
})

conexao.connect(function (erro) {
    if (erro) {
        console.log("Deu ruim na conexão \n");
        throw erro;
    } else {
        console.log("Conexão deu bom \n")
    }
})

app.post("/reserva/", function (req, res) {

    const data = req.body;
    conexao.query('INSERT INTO agendamentos set ?', [data], function (erro, resultado) {
        if (erro) {
            res.json(erro);
        }
        res.send(resultado.insertId)
    });
})

app.listen(3000)