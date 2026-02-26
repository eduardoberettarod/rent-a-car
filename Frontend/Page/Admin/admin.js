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

const currentPage = window.location.pathname.split("/").pop()

document.querySelectorAll(".sidebar-content a").forEach(link => {
    const linkPage = link.getAttribute("href").split("?")[0]

    if (linkPage === currentPage) {
        link.classList.add("active")
    }
})