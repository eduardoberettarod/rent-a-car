document.getElementById("form-registro")
    .addEventListener("submit", function (e) {

        e.preventDefault()

        if (!this.checkValidity()) {
            this.classList.add("was-validated")
            return
        }

        const login = document.getElementById("usuario").value
        const senha = document.getElementById("senha").value

        fetch("http://127.0.0.1:3000/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ login, senha })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao registrar")
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                fnLimparCampos()
                window.location.href = "../login.html"
            })
            .catch(err => {
                console.log("ERRO:", err)
                alert("Erro ao registrar usuário")
            })
    })

function fnLimparCampos() {
    const form = document.getElementById("form-registro")
    form.reset()
    form.classList.remove("was-validated")
}