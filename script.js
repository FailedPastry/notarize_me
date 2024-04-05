function uploadDocument(event, form) {
    event.preventDefault();
  
    const fileInput = form.querySelector('input[type="file"]');

    // Check if a file is selected
  if (!fileInput.files.length) {
    alert("Please select a document to upload.");
    return;
  }

  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("document", file);

  fetch('/upload-document', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.ok) {
      console.log("Document uploaded successfully!");
    } else {
        console.error("Error uploading document:", response.statusText);
    }
})
.catch(error => {
  console.error("Error:", error);
});
}