function fnReservarCarro() {

    let formDados = {
        nome_cliente: document.getElementById("nome_cliente").value,
        email_cliente: document.getElementById("email_cliente").value,
        veiculo_id: document.getElementById("categoria").value
    }
    console.dir(formDados)

    fetch('http://localhost:3000/reserva/', {
        method: 'POST',
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

function fnLimparCampos() {
    document.getElementById("form-reserva").reset()
}

let btn_reserva = document.getElementById("btn-reserva")

document.getElementById("form-reserva")
.addEventListener("submit", function(e){

    e.preventDefault()

    if (!this.checkValidity()) {
        this.classList.add("was-validated")
        return
    }

    this.classList.add("was-validated")
    fnReservarCarro()
})

const selectVeiculo = document.getElementById("categoria")
const confirmCar = document.getElementById("confirm-car")
const confirmPrice = document.querySelector(".confirm-price")

selectVeiculo.addEventListener("change", function () {

    const optionSelecionada = this.options[this.selectedIndex]

    if (this.value === "") {

        confirmCar.style.display = "none"
        return
    }

    const valor = optionSelecionada.dataset.valor

    confirmPrice.textContent = `R$ ${Number(valor).toFixed(2).replace(".", ",")}`

    confirmCar.style.display = "flex"
})

function carregarVeiculos() {

    fetch("http://localhost:3000/veiculos-select")
        .then(res => res.json())
        .then(dados => {

            const select = document.getElementById("categoria")

            select.innerHTML = '<option value="">Selecione um veículo</option>'

            dados.forEach(veiculo => {

                const option = document.createElement("option")

                option.value = veiculo.id
                option.textContent = `${veiculo.modelo} - ${veiculo.categoria}`

                // 👇 guardando o valor da diária dentro do option
                option.dataset.valor = veiculo.valor_diaria

                select.appendChild(option)
            })
        })
        .catch(erro => console.log(erro))
}

carregarVeiculos()