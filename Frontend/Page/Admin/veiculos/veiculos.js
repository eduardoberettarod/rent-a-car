//Background do modal
const inputFoto = document.getElementById("foto")
const preview = document.getElementById("preview-foto")

inputFoto.addEventListener("input", () => {

    if (inputFoto.value.trim() !== "") {
        preview.style.backgroundImage = `url('${inputFoto.value}')`
    } else {
        preview.style.backgroundImage = "url('../../../image/fundo.jpeg')"
    }
})

//conteudo para criar um card do novo veiculo
function fnMontarCardCarro(veiculo) {

    let corStatus = "";
    let textoStatus = "";

    if (veiculo.status === "disponivel") {
        corStatus = "text-success border-success";
        textoStatus = "Disponível";
    }
    else if (veiculo.status === "ocupado") {
        corStatus = "text-danger border-danger";
        textoStatus = "Ocupado";
    }
    else if (veiculo.status === "manutencao") {
        corStatus = "text-warning border-warning";
        textoStatus = "Manutenção";
    }

    const valorBR = Number(veiculo.valor_diaria)
        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })

    const [parteInteira, parteDecimal] = valorBR.split(",")

    let card = `
        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-1">
            <div class="card-car">

                <div class="card-car-header">
                    <div>
                        <h4>${veiculo.modelo}</h4>
                        <span class="text-muted">${veiculo.marca}</span>
                        <div class="position-absolute top-0 end-0 me-2 mt-2">
                            <span class="status ${corStatus}">
                                ${textoStatus}
                            </span>
                        </div>
                        
                    </div>
                </div>

                <div class="card-car-content">
                    <div class="card-car-image-container">
                        <img src="${veiculo.foto}" alt="">
                    </div>

                    <div class="row mt-2">
                        <div class="col-6">
                            <div class="row">
                                <div class="col-12">
                                    <span class="fw-semibold valor-diaria">
                                        ${parteInteira}<span class="fs-6">,${parteDecimal}</span>
                                    </span>
                                </div>
                                <div class="col-12">
                                    <span class="text-muted placa">${veiculo.placa}</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-6">
                            <span class="categoria">${veiculo.categoria}</span>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    `

    document.querySelector(".lista-veiculos").innerHTML += card
}

//Limpar o formulario após o cadastro de um veiculo
function fnLimparCampos() {
    document.getElementById("formCadastroCarro").reset()
}

//Cadastrar Veiculo
let btn_cadastrar = document.getElementById("btn-cadastrar-veiculo")

btn_cadastrar.addEventListener("click", function () {
    fnCadastrarVeiculos()
})

//cadastrar um novo veiculo
function fnCadastrarVeiculos() {

    let formDados = {
        modelo: document.getElementById("modelo").value,
        marca: document.getElementById("marca").value,
        placa: document.getElementById("placa").value,
        foto: document.getElementById("foto").value,
        categoria_id: document.getElementById("categoria").value
    }
    console.dir(formDados)

    fetch('http://127.0.0.1:3000/veiculos/', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formDados)
    })

        .then(resposta => resposta.json())
        .then((dados) => {
            fnLimparCampos()
            console.log(dados)
        })
        .catch(erro => console.log(erro.message))
}

//para carregar os dados da tabela veiculos para a pagina
function fnCarregarDados() {

    document.querySelector(".lista-veiculos").innerHTML = ""


    fetch('http://127.0.0.1:3000/veiculos/', {
        method: 'GET',
        credentials: 'include'
    })

        .then(response => {

            if (response.status === 401) {
                window.location.href = "../../LoginAdmin/login.html";
                return;
            }

            return response.json();
        })
        .then((veiculos) => {

            if (!veiculos) return;

            veiculos.forEach(veiculo => {
                fnMontarCardCarro(veiculo)
            });

        })
        .catch(erro => console.log(erro.message))
}

fnCarregarDados()