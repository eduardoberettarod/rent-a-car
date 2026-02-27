function fnReservarCarro() {

    let formDados = {
        nome_cliente: document.getElementById("nome_cliente").value,
        email_cliente: document.getElementById("email_cliente").value,
        categoria: document.getElementById("categoria").value
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
