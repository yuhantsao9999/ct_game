const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controller/teamData');
const { insertOneCode } = require('../controller/storePythonCode');
const router = express.Router();

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(aia)$/)) {
            cb(new Error('Please upload an aia file'));
        }
        cb(null, true);
    },
});

router.post('/uploadFileName', upload.single('files'), async (req, res) => {
    const result = await uploadFile(req);
    if (result.error) {
        console.log(`upload error`);
        res.status(404).send('upload error');
    } else {
        console.log(`upload succcessfully`);
        res.send('upload successfully');
    }
});

router.post('/insertPythonCode', async (req, res) => {
    const result = await insertOneCode(req);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});

module.exports = router;
