const router = require('express').Router();

const baseApi = '/api/v1';

router.use(baseApi, require('./webhooks'))
module.exports = router;