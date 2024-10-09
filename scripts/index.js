function fetchGeneratedNumber() {
    fetch('api/qrcodes/count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalCodesGenerated').innerText = data.count;
        })
        .catch(error => {
            console.error(error);
        });
}

window.onload = function() {
    fetchGeneratedNumber();
}