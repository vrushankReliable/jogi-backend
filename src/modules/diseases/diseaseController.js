const Disease = require('./diseaseModel');
const mongoose = require('mongoose');

exports.getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find({ isPublished: true }).sort('name');
    res.status(200).json({ success: true, count: diseases.length, data: diseases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllDiseases = async (req, res) => {
    try {
      const diseases = await Disease.find().sort('name');
      res.status(200).json({ success: true, count: diseases.length, data: diseases });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

exports.getDisease = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    if (!idOrSlug) return res.status(400).json({ success: false, error: 'ID or Slug is required' });

    let query = { slug: idOrSlug };
    
    // Check if it's a valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        query = { _id: idOrSlug };
    }
    
    const disease = await Disease.findOne(query);

    if (!disease) {
      return res.status(404).json({ success: false, error: 'Disease not found' });
    }
    
    res.status(200).json({ success: true, data: disease });
  } catch (err) {
    console.error('getDisease Error:', err);
    res.status(500).json({ success: false, error: 'Server error retrieving disease' });
  }
};

exports.createDisease = async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json({ success: true, data: disease });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!disease) return res.status(404).json({ success: false, error: 'Disease not found' });
    res.status(200).json({ success: true, data: disease });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ success: false, error: 'Disease not found' });
    await disease.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
