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
    fnReservarCarro()
})

//Validação do bootstrap
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()