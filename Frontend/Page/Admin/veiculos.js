const inputFoto = document.getElementById("foto")
const preview = document.getElementById("preview-foto")

inputFoto.addEventListener("input", () => {

    if (inputFoto.value.trim() !== "") {
        preview.style.backgroundImage = `url('${inputFoto.value}')`
    } else {
        preview.style.backgroundImage = "url('../../image/fundo.jpeg')"
    }
})