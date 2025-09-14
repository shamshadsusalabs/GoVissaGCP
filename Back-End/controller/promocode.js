const PromoCode = require('../shcema/promocode');

// Create
exports.createPromoCode = async (req, res) => {
  try {
    const promo = new PromoCode(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json(promos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
exports.getPromoCodeById = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    res.status(200).json(promo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updatePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    res.status(200).json(promo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deletePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validate Promo Code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) return res.status(404).json({ error: 'Invalid promo code' });

    const now = new Date();
    if (promo.usedCount >= promo.maxUsage) return res.status(400).json({ error: 'Promo usage limit reached' });
    if (now < promo.validFrom || now > promo.validUntil) return res.status(400).json({ error: 'Promo expired or not valid now' });

    res.status(200).json(promo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Increment Usage Count
exports.incrementPromoCodeUsage = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) return res.status(404).json({ error: 'Promo code not found' });

    const now = new Date();
    if (promo.usedCount >= promo.maxUsage) return res.status(400).json({ error: 'Usage limit reached' });
    if (now < promo.validFrom || now > promo.validUntil) return res.status(400).json({ error: 'Promo code is not valid at this time' });

    promo.usedCount += 1;
    await promo.save();

    res.status(200).json({ message: 'Promo code usage incremented', promo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
