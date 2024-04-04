const canvas = document.getElementById('signature-box');

// Check if signaturePad is available (from signature.js)
if (typeof SignaturePad !== "undefined") {
  const signaturePad = new SignaturePad(canvas);

  // Function to clear the signature
  function clearSignature() {
    signaturePad.clear();
  }

  // Submit form button click handler (optional, modify as needed)
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.addEventListener('click', () => {
    // Get the signature data as a base64 encoded string
    const signatureData = signaturePad.toDataURL();
    console.log("Signature data:", signatureData);

    // You can send the signatureData to your server for further processing
    // (e.g., store it in a database)

    // Prevent default form submission if needed
    // event.preventDefault();
  });
} else {
  console.error("signature.js not found.");
}
