document.addEventListener("DOMContentLoaded", function () {
    const availableTables = document.querySelectorAll(".table-list-container .tables")
    const selectedContainer = document.querySelector(".table-selected-container")

    availableTables.forEach((tableEl) => {
        tableEl.addEventListener("click", () => {

            const tableName = tableEl.querySelector("h3").innerText
            const alreadySelected = [...selectedContainer.querySelectorAll("h3")].some(
                (h3) => h3.innerText === tableName
            )
            if (alreadySelected) return

            tableEl.classList.add("clicked")

            const cloned = tableEl.cloneNode(true)

            const icon = cloned.querySelector(".fa-square-plus")
            if (icon) {
                icon.classList.remove("fa-square-plus")
                icon.classList.add("fa-square-minus")
            }

            cloned.addEventListener("click", () => {
                cloned.remove()
                tableEl.classList.remove("clicked")
            })

            selectedContainer.appendChild(cloned);
        })
    })
})



