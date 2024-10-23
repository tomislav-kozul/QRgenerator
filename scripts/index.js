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

async function getTokenFromServer() {
    try {
        const response = await axios.get('/api/token');  
        return response.data.token;
    } catch (error) {
        throw error;
    }
}

window.onload = function() {
    fetchGeneratedNumber();
    
    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const vat_input = document.getElementById('vat_input').value;
        const first_name_input = document.getElementById('first_name_input').value;
        const last_name_input = document.getElementById('last_name_input').value;
        
        const inputData = {
            vatin: vat_input,
            firstName: first_name_input,
            lastName: last_name_input
        };
    
        try {
            /*const response = await fetch('/api/generate-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });*/

            const accessToken = await getTokenFromServer();
            const generateCodeURL = window.location.origin + '/api/generate-code';

            const response = await axios.post(generateCodeURL, inputData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                }
            });
    
            if (response.status !== 200) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = response.data;

            const id = data.id;
            const currentDomain = window.location.origin;
            const qrURL = currentDomain + '/ticket/' + id
    
            const dataURL = await QRCode.toDataURL(qrURL, {
                width: 512
            });
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

            if (err.response && err.response.data && err.response.data.error) {
                document.getElementById('error-text').innerText = err.response.data.error;
            } else {
                document.getElementById('error-text').innerText = err.message || 'An unexpected error occurred';
            }
        }
    });
}