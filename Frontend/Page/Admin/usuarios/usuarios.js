function fnMontarTabelaUsuarios(usuario) {


    let tabela = `
        <tr id="linha-${usuario.id}">
            <td class="py-2 text-center align-middle">${usuario.id}</td>

            <td class="py-2 text-center align-middle">${usuario.login}</td>

            <td class="py-2 text-center align-middle">${usuario.nivel_acesso}</td>

            <td class="py-2 text-center align-middle">
                ${new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
            </td>

            <td class="py-2 align-middle">
                <div class="d-flex justify-content-center align-items-center">    
                    <button 
                        type="button" 
                        class="btn"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal"
                        onclick="setUsuarioParaExcluir(${usuario.id})" ,
                        event.target
                    >
                        <i class="bi bi-trash text-danger"></i>
                    </button>       
                </div>
            </td>
        </tr>
    `

    document.getElementById("lista-usuarios").innerHTML += tabela
}


let usuarioSelecionado = null

function setUsuarioParaExcluir(id) {
    usuarioSelecionado = id
}

document.getElementById("btnConfirmarDelete")
    .addEventListener("click", function () {
        if (usuarioSelecionado !== null) {
            fnExcluirUsuario(usuarioSelecionado)
        }
    })

async function fnExcluirUsuario(id) {

    try {

        const res = await fetch('http://127.0.0.1:3000/usuarios/' + id, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (res.status === 403) {
            alert("Você não tem permissão para excluir usuários");
            return;
        }

        if (res.status === 401) {
            alert("Sessão expirada.");
            window.location.href = "../../LoginAdmin/login.html";
            return;
        }

        const dados = await res.json();

        const linha = document.getElementById(`linha-${id}`);
        if (linha) linha.remove();

        const modalElement = document.getElementById('deleteModal');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.hide();

    } catch (erro) {
        console.log(erro.message);
    }
}

function fnCarregarDados() {

    document.getElementById("lista-usuarios").innerHTML = ""

    fetch('http://127.0.0.1:3000/usuarios', {
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
        .then((usuarios) => {

            if (!usuarios) return;

            usuarios.forEach(usuario => {
                console.log(usuario)
                fnMontarTabelaUsuarios(usuario)
            });
        })
        .catch(erro => console.log(erro.message))
}

fnCarregarDados()