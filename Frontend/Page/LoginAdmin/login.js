document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault()

    const login = document.querySelector("input[type='text']").value
    const senha = document.querySelector("input[type='password']").value

    fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ login, senha })
    })
        .then(res => {

            if (res.status === 401) {
                alert("Usuário ou senha incorretos");
                return null;
            }

            return res.json();
        })
        .then(data => {

            if (!data) return;

            window.location.href = "../Admin/veiculos/veiculos.html";

        })
        .catch(err => console.log(err))
})