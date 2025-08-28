const router = require('express').Router();
const { create, list, getOne } = require('../controllers/lead.controller');
const validate = require('../middlewares/validate');
const { createLeadSchema } = require('../validators/lead.validator');

router.post('/', validate(createLeadSchema), create);
router.get('/', list);
router.get('/:id', getOne);

module.exports = router;
