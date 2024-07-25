const mongoose = require('mongoose');

// Define schema
const carSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    trim: { type: String, required: true },
    mileage: { type: Number, required: true },
    vehiclePictures: [String],
    registrationPapers: [String],
    personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        province: { type: String, required: true },
        message: { type: String, required: true }
    }
});

// Create model
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
