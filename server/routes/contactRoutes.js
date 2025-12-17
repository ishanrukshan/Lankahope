import express from 'express';

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // In a real application, you would send an email here using Nodemailer
    // or store the message in the database.
    // For this clone, we will just log it and return success.

    console.log('Contact Form Submitted:', { name, email, subject, message });

    res.status(200).json({ message: 'Message sent successfully!' });
});

export default router;
