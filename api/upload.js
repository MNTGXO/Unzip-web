const { IncomingForm } = require('formidable');
const AdmZip = require('adm-zip');
const mime = require('mime-types');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send(err.message);

    try {
      // Load the uploaded ZIP buffer
      const zipFile = Array.isArray(files.zips) ? files.zips[0] : files.zips;
      const zip = new AdmZip(zipFile.filepath);
      const entries = zip.getEntries().filter(e => !e.isDirectory);

      // Build an in-memory map of filename → Buffer
      const fileMap = {};
      entries.forEach(entry => {
        fileMap[entry.entryName] = entry.getData();
      });

      // Store fileMap in-memory on this cold-start function.
      // (Note: on Vercel, successive calls may be the same instance.)
      req.app = req.app || {};
      req.app._files = fileMap;

      // Return the filenames
      res.setHeader('Content-Type', 'application/json');
      res.send({
        files: entries.map(e => ({
          name: e.entryName,
          size: e.getData().length,
          downloadUrl: `/api/download?name=${encodeURIComponent(e.entryName)}`
        }))
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Failed to extract ZIP');
    }
  });
};
