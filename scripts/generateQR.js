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
            throw new Error('Error: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Success:', data);

        const id = data.id;
        const currentDomain = window.location.origin;
        const qrURL = currentDomain + '/' + id

        // Using await with QRCode to get the QR code data
        const dataURL = await QRCode.toDataURL(qrURL);
        const qrImage = document.getElementById("qr-code-image");
        qrImage.src = dataURL;

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate QR code');
    }
});
