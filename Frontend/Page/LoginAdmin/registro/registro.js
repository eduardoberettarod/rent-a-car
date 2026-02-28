document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault()

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
        
        .then(data => {

            if (!data) return;

            window.location.href = "../login.html";

        })
        .catch(err => console.log(err))
})