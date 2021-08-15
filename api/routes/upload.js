const express = require('express');
const multer = require('multer');
const { uploadFile, findOne } = require('../controller/teamData');
const router = express.Router();

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(aia)$/)) {
            cb(new Error('Please upload an aia file'));
        }
        cb(null, true);
    },
});

router.post('/findUploadDealine', async (req, res) => {
    const userData = await findOne(req);
    if (userData.error) {
        res.status(404).send('Not found');
    } else {
        console.log('userData.data', userData.data);
        res.send(userData.data);
    }
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

module.exports = router;
