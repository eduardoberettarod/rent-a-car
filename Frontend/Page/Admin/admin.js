//codigo da sidebar
const sidebar = document.querySelector(".sidebar")
const toggleBtn = document.querySelector(".sidebar-header button")

toggleBtn.addEventListener("click", () => {

    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show")
        sidebar.classList.add("close")
    } else {
        sidebar.classList.remove("close")
        sidebar.classList.add("show")
    }

})

const currentPath = window.location.pathname

document.querySelectorAll(".sidebar-content a").forEach(link => {
    const linkPath = new URL(link.href).pathname

    if (linkPath === currentPath) {
        link.classList.add("active")
    }
})

//funcao para mostrar o login e o nivel de acesso do usuario no footer da sidebar
function carregarUsuarioLogado() {

    fetch("http://127.0.0.1:3000/usuario-logado", {
        method: "GET",
        credentials: "include"
    })
    .then(res => {

        if (res.status === 401) {
            window.location.href = "../../LoginAdmin/login.html";
            return;
        }

        return res.json();
    })
    .then(usuario => {

        if (!usuario) return;

        document.getElementById("nome-usuario-logado").innerText =
            usuario.login;
        document.getElementById("nivel-usuario-logado").innerText =
            usuario.nivel_acesso;
    })
    .catch(erro => console.log(erro));
}

carregarUsuarioLogado();