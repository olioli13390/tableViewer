function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: type === 'error' ? '#ff4d4d' : '#4BB543',
        stopOnFocus: true
    }).showToast();
}

