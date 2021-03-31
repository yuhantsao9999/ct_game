const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controller/teamData');
const router = express.Router();

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(aia)$/)) {
            cb(new Error('Please upload an aia file'));
        }
        cb(null, true);
    },
});

router.post('/uploadFile', upload.single('files'), async (req, res) => {
    const result = await uploadFile(req);
    if (result.error) {
        console.log(`upload error`);
        res.status(404).send('upload error');
    } else {
        console.log(`upload succcessfully`);
        res.send('upload successfully');
    }
});

module.exports = router;