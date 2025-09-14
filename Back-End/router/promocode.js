const express = require('express');
const router = express.Router();
const promoCtrl = require('../controller/promocode');

router.post('/add', promoCtrl.createPromoCode);
router.get('/getAll', promoCtrl.getAllPromoCodes);
router.get('/:id', promoCtrl.getPromoCodeById);
router.put('/:id', promoCtrl.updatePromoCode);
router.delete('/:id', promoCtrl.deletePromoCode);

// Special Route for Validation
router.post('/validate', promoCtrl.validatePromoCode);

router.post('/incrementUsage', promoCtrl.incrementPromoCodeUsage);

module.exports = router;
