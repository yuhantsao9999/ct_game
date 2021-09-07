const express = require('express');
const multer = require('multer');
const { checkUploadDeadline, uploadFileName } = require('../controller/file');
const router = express.Router();

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(aia)$/)) {
            cb(new Error('Please upload an aia file'));
        }
        cb(null, true);
    },
});

router.post('/getfileUploadDeadline', async (req, res) => {
    const { teamId } = req.body;
    const dealine = await checkUploadDeadline(teamId);
    if (dealine.error) {
        res.status(404).send('Upload has closed');
    } else {
        res.send(dealine);
    }
});

router.post('/uploadFileName', upload.single('files'), async (req, res) => {
    const result = await uploadFileName(req.file, req.body);
    if (result.error) {
        console.log(`upload error`);
        res.status(404).send('upload error');
    } else {
        console.log(`upload succcessfully`);
        res.send('upload successfully');
    }
});

module.exports = router;
