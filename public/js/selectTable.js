document.addEventListener("DOMContentLoaded", function () {
			const availableTables = document.querySelectorAll(".table-list-container .tables")
			const selectedContainer = document.getElementById("selected-container")
			const hiddenInput = document.getElementById("selectedTablesInput")

			const selectedTableNames = new Set()

			function updateHiddenInput() {
				hiddenInput.value = JSON.stringify(Array.from(selectedTableNames))
			}

			availableTables.forEach((tableEl) => {
				tableEl.addEventListener("click", () => {
					const tableName = tableEl.dataset.table
					if (selectedTableNames.has(tableName)) return

					const cloned = tableEl.cloneNode(true)
					cloned.classList.add("selected")

					const icon = cloned.querySelector("i.fa-square-plus")
					if (icon) {
						icon.classList.remove("fa-square-plus")
						icon.classList.add("fa-square-minus")
					}

					cloned.addEventListener("click", () => {
						selectedContainer.removeChild(cloned)
						selectedTableNames.delete(tableName)
						updateHiddenInput()
					})

					selectedContainer.appendChild(cloned)
					selectedTableNames.add(tableName)
					updateHiddenInput()
				})
			})
		})