const form = document.getElementById('uploadForm');
const progress = document.getElementById('progress');
const fileList = document.getElementById('fileList');

form.addEventListener('submit', async e => {
  e.preventDefault();
  progress.textContent = 'Uploading and extracting…';
  fileList.innerHTML = '';

  const fileInput = document.getElementById('zips');
  if (!fileInput.files.length) {
    progress.textContent = 'Please select a ZIP file.';
    return;
  }

  const formData = new FormData();
  formData.append('zips', fileInput.files[0]);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error(res.statusText);
    const { files } = await res.json();

    progress.textContent = `Found ${files.length} file(s):`;
    files.forEach(f => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = f.downloadUrl;
      a.textContent = `${f.name} (${(f.size/1024).toFixed(1)} KB)`;
      li.appendChild(a);
      fileList.appendChild(li);
    });
  } catch (err) {
    progress.textContent = 'Error: ' + err.message;
  }
});
