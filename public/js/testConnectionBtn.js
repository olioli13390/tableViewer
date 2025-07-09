const testBtn = document.getElementById("testBtn")
const connectBtn = document.getElementById("connectBtn")
const form = document.getElementById("dbForm")

testBtn.addEventListener("click", async () => {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
        const res = await fetch("/testDb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        const result = await res.json()

        showToast(result.message, result.success ? "success" : "error")

        if (result.success) {
            testBtn.classList.add("hidden")
            connectBtn.classList.remove("hidden")
        }
    } catch (error) {
        showToast("Failed to test connection", "error")
    }
})