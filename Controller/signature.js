const canvas = document.getElementById('signature-box');

// Check if signaturePad is available (from signature.js)
if (typeof SignaturePad !== "undefined") {
  const signaturePad = new SignaturePad(canvas);

  // Function to clear the signature
  function clearSignature() {
    signaturePad.clear();
  }

  // Add event listener to the form submit event
  document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get the signature data as a base64 encoded string
    const signatureData = signaturePad.toDataURL();
    console.log("Signature data:", signatureData);

    // Upload signature data to the server
    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: JSON.stringify({ signature: signatureData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("Upload response:", data);
      
      // Handle response from the server as needed
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  });
} else {
  console.error("signature.js not found.");
}