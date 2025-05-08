const { IncomingForm } = require('formidable');
const AdmZip = require('adm-zip');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = new IncomingForm({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send(err.message);

    try {
      const combinedZip = new AdmZip();
      const fileArray = Array.isArray(files.zips) ? files.zips : [files.zips];

      for (const file of fileArray) {
        const zip = new AdmZip(file.filepath);
        zip.getEntries().forEach(entry => {
          if (!entry.isDirectory) {
            combinedZip.addFile(entry.entryName, entry.getData());
          }
        });
      }

      // send combined ZIP as response for immediate download
      const outBuffer = combinedZip.toBuffer();
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="combined.zip"');
      return res.send(outBuffer);
    } catch (e) {
      console.error(e);
      return res.status(500).send('Extraction failed');
    }
  });
};
