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