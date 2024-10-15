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
    
    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const vat_input = document.getElementById('vat_input').value;
        const first_name_input = document.getElementById('first_name_input').value;
        const last_name_input = document.getElementById('last_name_input').value;
    
        console.log("macka");
    
        const inputData = {
            vatin: vat_input,
            firstName: first_name_input,
            lastName: last_name_input
        };
    
        console.log(JSON.stringify(inputData));
    
        try {
            const response = await fetch('/api/generate-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
    
            if (!response.ok) {
                
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const data = await response.json();

            const id = data.id;
            const currentDomain = window.location.origin;
            const qrURL = currentDomain + '/' + id
    
            const dataURL = await QRCode.toDataURL(qrURL);
            const qrImage = document.getElementById("qr-code-image");
            qrImage.src = dataURL;

            document.getElementById('response-first-name').innerText = first_name_input;
            document.getElementById('response-vat').innerText = vat_input;
            document.getElementById('response-left').innerText = data.left;

            document.querySelector('.response').classList.remove('no-show');
            document.querySelector('.error').classList.add('no-show');
        } catch (err) {
            document.querySelector('.response').classList.add('no-show');
            document.querySelector('.error').classList.remove('no-show');

            document.getElementById('error-text').innerText = err.message;
        }
    });
    
}