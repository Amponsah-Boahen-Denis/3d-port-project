const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://3d-front.vercel.app"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

// Serve static files from the '3d-portfolio-main' directory
app.use(express.static(path.join(__dirname, '3d-portfolio-main')));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '3d-portfolio-main', 'index.html'));
});

// Serve admin.html at /admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '3d-portfolio-main', 'admin.html'));
});

// Route to fetch data as JSON
app.get('/api/data', async (req, res) => {
    try {
        const wallname = await Wallname.findOne();
        const contact = await Contact.findOne();
        const projects = await Projects.findOne();

        res.json({ wallname, contact, projects });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server Error');
    }
});

// Route to handle form submission and file uploads
app.post('/save', upload.fields([
    { name: 'project1Image' }, 
    { name: 'project2Image' }, 
    { name: 'project3Image' },
    { name: 'project4Image' },
    { name: 'profile' }
]), async (req, res) => {
    try {
        // Fetch existing data
        const existingWallname = await Wallname.findOne() || {};
        const existingContact = await Contact.findOne() || {};
        const existingProjects = await Projects.findOne() || {};

        // Extract data from the request
        const { name, about, email, facebook, tiktok, linkedin, instagram, youtube, link1, link2, link3, link4 } = req.body;

        // Base URL for images stored in the GitHub repository
        const githubBaseURL = 'https://raw.githubusercontent.com/Amponsah-Boahen-Denis/imagesfiles/main/textures/';

        // Handle profile image
        const profileImage = req.files.profile 
            ? `${githubBaseURL}${req.files.profile[0].filename}` 
            : existingWallname.profile;

        // Update Wallname document
        await Wallname.findOneAndUpdate({}, {
            name: name || existingWallname.name,
            about: about || existingWallname.about,
            profile: profileImage || existingWallname.profile
        }, { upsert: true, new: true });

        // Update Contact document
        await Contact.findOneAndUpdate({}, {
            email: email || existingContact.email,
            facebook: facebook || existingContact.facebook,
            tiktok: tiktok || existingContact.tiktok,
            linkedin: linkedin || existingContact.linkedin,
            instagram: instagram || existingContact.instagram,
            youtube: youtube || existingContact.youtube
        }, { upsert: true, new: true });

        // Update Projects document
        await Projects.findOneAndUpdate({}, {
            project1Image: req.files.project1Image 
                ? `${githubBaseURL}${req.files.project1Image[0].filename}` 
                : existingProjects.project1Image,
            link1: link1 || existingProjects.link1,
            project2Image: req.files.project2Image 
                ? `${githubBaseURL}${req.files.project2Image[0].filename}` 
                : existingProjects.project2Image,
            link2: link2 || existingProjects.link2,
            project3Image: req.files.project3Image 
                ? `${githubBaseURL}${req.files.project3Image[0].filename}` 
                : existingProjects.project3Image,
            link3: link3 || existingProjects.link3,
            project4Image: req.files.project4Image 
                ? `${githubBaseURL}${req.files.project4Image[0].filename}` 
                : existingProjects.project4Image,
            link4: link4 || existingProjects.link4
        }, { upsert: true, new: true });

        res.redirect('https://back-api-mu.vercel.app/admin.html');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Server Error');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
