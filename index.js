const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//necessario para permitir requisições de diferentes origens (dominios/servidores)
const cors = require('cors')
app.use(cors({
    origin: "http://127.0.0.1:5500", // ou a porta que você usa no Live Server
    credentials: true
}));

//lib para hash da senha do usuario
const bcrypt = require('bcrypt');

//salvar usuario apos sessao de login
const session = require('express-session');
app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true só em HTTPS
}));

app.use(express.json())

app.get('/', function (req, res) {
    res.send('Locadora de veículos')
})

let mysql = require('mysql')
let conexao = mysql.createConnection({
    host: "localhost",
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

app.post("/registro", async function (req, res) {

    try {

        const { login, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = {
            login: login,
            senha: senhaHash,
            nivel_acesso: "operador"
        };

        conexao.query(
            "INSERT INTO usuarios SET ?",
            [novoUsuario],
            function (erro, resultado) {

                if (erro) {
                    console.log(erro);
                    return res.status(500).json("Erro ao registrar usuário");
                }

                res.json("Usuário registrado com sucesso");
            }
        );

    } catch (erro) {
        console.log(erro);
        res.status(500).json("Erro no servidor");
    }
});

app.get("/veiculos-select", function (req, res) {

    conexao.query(`
        SELECT 
            v.id,
            v.modelo,
            c.nome AS categoria,
            c.valor_diaria
        FROM veiculos v
        INNER JOIN categorias c
            ON v.categoria_id = c.id
        ORDER BY c.nome, v.modelo
    `, function (erro, resultado) {

        if (erro) {
            return res.status(500).json(erro)
        }

        res.json(resultado)
    })
})

app.get("/veiculos", verificarLogin, function (req, res) {

    conexao.query(`
        SELECT 
            v.id,
            v.modelo,
            v.marca,
            v.placa,
            v.foto,
            c.nome AS categoria,
            c.valor_diaria
        FROM veiculos v
        JOIN categorias c 
            ON v.categoria_id = c.id
    `, function (erro, resultado) {

        if (erro) {
            console.log(erro)
            res.status(500).json(erro)
        } else {
            res.json(resultado)
        }

    })
})

app.post("/veiculos", verificarLogin, function (req, res) {
    const data = req.body;
    conexao.query('INSERT INTO veiculos set ?', [data], function (erro, resultado) {
        if (erro) {
            res.json(erro)
        }
        res.send(resultado.insertId)
    })
})

app.post("/usuarios", verificarLogin, function (req, res) {
    const data = req.body;
    conexao.query('INSERT INTO usuarios set ?', [data], function (erro, resultado) {
        if (erro) {
            res.json(erro)
        }
        res.send(resultado.insertId)
    })
})

app.get("/usuarios", verificarLogin, function (req, res) {
    conexao.query(
        `SELECT id,
        login,
        nivel_acesso,
        criado_em 
        FROM usuarios`,
        function (erro, resultado) {

            if (erro) {
                console.log(erro)
                res.status(500).json(erro)
            } else {
                res.json(resultado)
            }
        }
    )
})

app.delete("/usuarios/:id", verificarLogin, verificarAdmin, function (req, res) {

    const id = req.params.id;

    conexao.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        function (erro, resultado) {

            if (erro) {
                console.log(erro);
                return res.status(500).json(erro);
            }

            res.json({ mensagem: "Usuário deletado", affectedRows: resultado.affectedRows });
        }
    );

});

app.post("/agendamentos", function (req, res) {
    const data = req.body;
    conexao.query('INSERT INTO agendamentos set ?', [data], function (erro, resultado) {
        if (erro) {
            res.json(erro)
        }
        res.send(resultado.insertId)
    })
})

app.get("/agendamentos", verificarLogin, function (req, res) {

    conexao.query(`
        SELECT 
            a.id,
            a.nome_cliente,
            a.email_cliente,
            a.veiculo_id,
            a.created_at,
            c.valor_diaria AS valor_diaria_reserva
        FROM agendamentos a
        INNER JOIN veiculos v 
            ON a.veiculo_id = v.id
        INNER JOIN categorias c 
            ON v.categoria_id = c.id
    `, function (erro, resultado) {

        if (erro) {
            console.log(erro)
            return res.status(500).json(erro)
        }

        res.json(resultado)
    })

})

app.delete("/agendamentos/:id", verificarLogin, function (req, res) {

    const id = req.params.id;

    conexao.query(
        "DELETE FROM agendamentos WHERE id = ?",
        [id],
        function (erro, resultado) {

            if (erro) {
                console.log(erro);
                return res.status(500).json(erro);
            }

            res.json({ mensagem: "Agendamento deletado", affectedRows: resultado.affectedRows });
        }
    );

});


app.post("/login", (req, res) => {

    const { login, senha } = req.body;

    conexao.query(
        "SELECT * FROM usuarios WHERE login = ?",
        [login],
        async (erro, resultado) => {

            if (erro) {
                console.log(erro);
                return res.status(500).json("Erro no servidor");
            }

            if (resultado.length === 0) {
                return res.status(401).json("Usuário não encontrado");
            }

            const usuario = resultado[0];

            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json("Senha incorreta");
            }

            req.session.usuario = {
                id: usuario.id,
                login: usuario.login,
                nivel_acesso: usuario.nivel_acesso
            };

            res.json("Login OK");
        }
    );
});

function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json("Não autorizado");
    }
    next();
}

app.get("/admin", verificarLogin, (req, res) => {
    res.json("Área protegida");
});

function verificarAdmin(req, res, next) {
    if (!req.session.usuario || req.session.usuario.nivel_acesso !== "admin") {
        return res.status(403).json("Acesso negado");
    }
    next();
}

app.get("/painel-admin", verificarAdmin, (req, res) => {
    res.json("Bem-vindo Admin");
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json("Logout realizado");
});


app.listen(3000)