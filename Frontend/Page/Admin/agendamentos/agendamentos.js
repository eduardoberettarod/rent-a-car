function fnMontarTabelaAgendamento(cliente) {

    let tabela = `
        <tr id="linha-${cliente.id}">
            <td class="py-2 text-center align-middle">${cliente.id}</td>

            <td class="py-2 text-center align-middle">${cliente.nome_cliente}</td>

            <td class="py-2 text-center align-middle">${cliente.email_cliente}</td>

            <td class="py-2 text-center align-middle">${cliente.veiculo_id}</td>

            <td class="py-2 text-center align-middle">${new Date(cliente.data_reserva).toLocaleDateString('pt-BR')}</td>

            <td class="py-2 text-center align-middle">${cliente.valor_diaria_reserva}</td>

            <td class="py-2 align-middle">
                <div class="d-flex justify-content-center align-items-center">    
                    <button 
                        type="button" 
                        class="btn"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal"
                        onclick="setAgendamentoParaExcluir(${cliente.id})" ,
                        event.target
                    >
                        <i class="bi bi-trash text-danger"></i>
                    </button>       
                </div>
            </td>
        </tr>
    `

    document.getElementById("lista-agendamentos").innerHTML += tabela
}


let agendamentoSelecionado = null

function setAgendamentoParaExcluir(id) {
    agendamentoSelecionado = id
}

document.getElementById("btnConfirmarDelete")
    .addEventListener("click", function () {
        if (agendamentoSelecionado !== null) {
            fnExcluirAgendamento(agendamentoSelecionado)
        }
    })

function fnExcluirAgendamento(id) {
    fetch('http://127.0.0.1:3000/agendamentos/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resposta => resposta.json())
        .then((dados) => {

            const linha = document.getElementById(`linha-${id}`)
            if (linha) {
                linha.remove()
            }

            document.activeElement.blur()

            const modalElement = document.getElementById('deleteModal')
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement)
            modalInstance.hide()
        })
        .catch(erro => console.log(erro.message))
}

function fnCarregarDados() {

    document.getElementById("lista-agendamentos").innerHTML = ""

    fetch('http://127.0.0.1:3000/agendamentos', {
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
        .then((clientes) => {

            if (!clientes) return;

            clientes.forEach(cliente => {
                console.log(cliente)
                fnMontarTabelaAgendamento(cliente)
            });
        })
        .catch(erro => console.log(erro.message))
}

fnCarregarDados()