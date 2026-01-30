require('dotenv').config();
const mongoose = require('mongoose');
const Disease = require('./src/modules/diseases/diseaseModel');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jogi-ayurved';

async function check() {
    await mongoose.connect(mongoUri);
    const diseases = await Disease.find();
    console.log(JSON.stringify(diseases, null, 2));
    process.exit(0);
}
check();
