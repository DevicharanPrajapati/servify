const express = require('express');
const router = express.Router();
const { getProviders, getProviderById } = require('../controllers/serviceController');

router.get('/', getProviders);
router.get('/:id', getProviderById);

module.exports = router;
