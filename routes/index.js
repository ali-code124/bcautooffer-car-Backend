const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'theron.greenholt61@ethereal.email',
      pass: 'Ec9s8uvd1wF7zpZ17P'
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Serve index.html file
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST route to send email
router.post('/send-email', async (req, res) => {
  const { f_name, l_name, email, message } = req.body;

  try {
    // Validate email fields
    if (!f_name || !l_name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
      from: email,
      to: 'info@ethereal.email', // Sending to this Ethereal email
      subject: 'Email Sent',
      text: `You have received a new contact form submission:\n\nName: ${f_name} ${l_name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    res.json({ message: 'Email sent successfully!', info: info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});

// POST route to handle car creation with additional info including file uploads
router.post('/cars/additional-info', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'papers', maxCount: 5 }]), async (req, res, next) => {
  try {
    const { year, make, model, trim, mileage, name, email, phone, province, message } = req.body;

    // Handle uploaded vehicle pictures
    let vehiclePictures = [];
    if (req.files['images']) {
      vehiclePictures = req.files['images'].map((file, index) => ({
        filename: file.filename,
        path: file.path,
        cid: `image${index}`
      }));
    }

    // Handle uploaded registration papers
    let registrationPapers = [];
    if (req.files['papers']) {
      registrationPapers = req.files['papers'].map((file, index) => ({
        filename: file.filename,
        path: file.path,
        cid: `paper${index}`
      }));
    }

    // Construct the email content
    const emailContent = `
      <h2>New car submission:</h2>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Make:</strong> ${make}</p>
      <p><strong>Model:</strong> ${model}</p>
      <p><strong>Trim:</strong> ${trim}</p>
      <p><strong>Mileage:</strong> ${mileage}</p>
      <p><strong>Pictures:</strong></p>
      ${vehiclePictures.map((picture, index) => `<img src="cid:image${index}" style="max-width: 200px;"><br>`).join('')}
      <p><strong>Papers:</strong></p>
      ${registrationPapers.map((paper, index) => `<img src="cid:paper${index}" style="max-width: 200px;"><br>`).join('')}
      <h2>Personal Information:</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Province:</strong> ${province}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    const mailOptions = {
      from: email,
      to: 'info@ethereal.email', // Sending to this Ethereal email
      subject: 'New Car Submission',
      html: emailContent,
      attachments: [...vehiclePictures, ...registrationPapers]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    res.json({ message: 'Car information sent successfully!', info: info });
  } catch (error) {
    console.error('Error sending car information:', error);
    res.status(500).json({ message: 'Failed to send car information.', error: error.message });
  }
});

module.exports = router;
