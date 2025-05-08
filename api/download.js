const mime = require('mime-types');

module.exports = (req, res) => {
  const name = req.query.name;
  const fileMap = (req.app && req.app._files) || {};

  if (!name || !fileMap[name]) {
    return res.status(404).send('File not found');
  }

  const buf = fileMap[name];
  const type = mime.lookup(name) || 'application/octet-stream';

  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  res.send(buf);
};
