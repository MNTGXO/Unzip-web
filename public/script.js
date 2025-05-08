const form = document.getElementById('uploadForm');
const progressDiv = document.getElementById('progress');

form.addEventListener('submit', async e => {
  e.preventDefault();
  progressDiv.textContent = 'Uploading...';
  
  const files = document.getElementById('zips').files;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('zips', files[i]);
  }

  try {
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error(response.statusText);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'combined.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    progressDiv.textContent = 'Download started!';
  } catch (err) {
    progressDiv.textContent = 'Error: ' + err.message;
  }
});
