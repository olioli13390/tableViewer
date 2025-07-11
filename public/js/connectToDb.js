window.addEventListener("DOMContentLoaded", () => {
    const type = document.querySelector('select[name="type"]').value
    const host = document.querySelector('input[name="host"]').value
    const port = document.querySelector('input[name="port"]').value
    const name = document.querySelector('input[name="name"]').value

    if (type && host && port && name) {
        document.getElementById("connectBtn").classList.remove("hidden")
    }
})