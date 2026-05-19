const express = require('express');
const multer = require('multer');
const path = require('path');
const { Startup, Admin } = require('../models');
const { sendRegistrationAck, sendAdminNotification } = require('../services/email');

const router = express.Router();

// Multer config for pitch deck uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/pitch_decks'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
});

// POST /api/public/register — Public startup registration
router.post('/register', upload.single('pitch_deck'), async (req, res) => {
  try {
    const {
      name, industry, stage, description, year_founded, website,
      contact_name, contact_designation, contact_email, contact_phone, contact_linkedin,
      team_members_count, resources_needed, referral_source,
    } = req.body;

    // Validation
    if (!name || !industry || !stage || !description || !contact_name || !contact_email || !contact_phone) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const startup = await Startup.create({
      name, industry, stage, description,
      year_founded: year_founded ? parseInt(year_founded, 10) : null,
      website: website || null,
      contact_name, contact_designation: contact_designation || null,
      contact_email, contact_phone,
      contact_linkedin: contact_linkedin || null,
      team_members_count: team_members_count ? parseInt(team_members_count, 10) : 1,
      resources_needed: resources_needed ? (typeof resources_needed === 'string' ? JSON.parse(resources_needed) : resources_needed) : [],
      referral_source: referral_source || null,
      pitch_deck_path: req.file ? req.file.filename : null,
      status: 'Pending Review',
    });

    // Send acknowledgement email to startup
    await sendRegistrationAck(startup);

    // Notify admin(s)
    const admins = await Admin.findAll();
    for (const admin of admins) {
      await sendAdminNotification(admin.email, startup);
    }

    res.status(201).json({
      message: 'Application submitted successfully! You will receive a confirmation email shortly.',
      applicationId: startup.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Only PDF files are allowed.') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

module.exports = router;
