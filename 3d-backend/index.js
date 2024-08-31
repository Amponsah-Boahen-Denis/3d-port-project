const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');  // Axios for making API requests

// Define schemas
// ... (schemas remain unchanged)

const Wallname = mongoose.model('Wallname', wallnameSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Projects = mongoose.model('Projects', projectsSchema);

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://3d-front.vercel.app", "https://admindashboard-henna.vercel.app"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

// Multer configuration for file uploads
const storage = multer.memoryStorage();  // Use memory storage for Multer
const upload = multer({ storage });

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../3d-portfolio-main', 'index.html'));
});

// Serve admin.html at /admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '3d-backend', 'admin.html'));
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

// Function to upload an image to imgbb
async function uploadToImgbb(imageBuffer, imageName) {
    const apiKey = 'b18e754ba818bd69ecf665b863eace47';
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const formData = new FormData();
    formData.append('image', imageBuffer.toString('base64'));
    formData.append('name', imageName);

    const response = await axios.post(imgbbUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.data.url;  // Return the URL of the uploaded image
}

// Route to handle form submission and file uploads
app.post('/save', upload.fields([
    { name: 'project1Image' }, 
    { name: 'project2Image' }, 
    { name: 'project3Image' },
    { name: 'project4Image' },
    { name: 'profile' }
]), async (req, res) => {
    try {
        const existingWallname = await Wallname.findOne() || {};
        const existingContact = await Contact.findOne() || {};
        const existingProjects = await Projects.findOne() || {};

        const { name, about, email, facebook, tiktok, linkedin, instagram, youtube, link1, link2, link3, link4 } = req.body;

        // Upload images to imgbb and get their URLs
        const profileImageUrl = req.files.profile 
            ? await uploadToImgbb(req.files.profile[0].buffer, req.files.profile[0].originalname) 
            : existingWallname.profile;

        const project1ImageUrl = req.files.project1Image 
            ? await uploadToImgbb(req.files.project1Image[0].buffer, req.files.project1Image[0].originalname) 
            : existingProjects.project1Image;

        const project2ImageUrl = req.files.project2Image 
            ? await uploadToImgbb(req.files.project2Image[0].buffer, req.files.project2Image[0].originalname) 
            : existingProjects.project2Image;

        const project3ImageUrl = req.files.project3Image 
            ? await uploadToImgbb(req.files.project3Image[0].buffer, req.files.project3Image[0].originalname) 
            : existingProjects.project3Image;

        const project4ImageUrl = req.files.project4Image 
            ? await uploadToImgbb(req.files.project4Image[0].buffer, req.files.project4Image[0].originalname) 
            : existingProjects.project4Image;

        // Update or create new documents in MongoDB
        await Wallname.findOneAndUpdate({}, {
            name: name || existingWallname.name,
            about: about || existingWallname.about,
            profile: profileImageUrl || existingWallname.profile
        }, { upsert: true, new: true });

        await Contact.findOneAndUpdate({}, {
            email: email || existingContact.email,
            facebook: facebook || existingContact.facebook,
            tiktok: tiktok || existingContact.tiktok,
            linkedin: linkedin || existingContact.linkedin,
            instagram: instagram || existingContact.instagram,
            youtube: youtube || existingContact.youtube
        }, { upsert: true, new: true });

        await Projects.findOneAndUpdate({}, {
            project1Image: project1ImageUrl || existingProjects.project1Image,
            link1: link1 || existingProjects.link1,
            project2Image: project2ImageUrl || existingProjects.project2Image,
            link2: link2 || existingProjects.link2,
            project3Image: project3ImageUrl || existingProjects.project3Image,
            link3: link3 || existingProjects.link3,
            project4Image: project4ImageUrl || existingProjects.project4Image,
            link4: link4 || existingProjects.link4
        }, { upsert: true, new: true });

        // Redirect back to the admin dashboard
        res.redirect('https://admindashboard-henna.vercel.app');
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




// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');

// // Define schemas
// const wallnameSchema = new mongoose.Schema({
//     name: String,
//     about: String,
//     profile: String
// });

// const contactSchema = new mongoose.Schema({
//     email: String,
//     facebook: String,
//     tiktok: String,
//     linkedin: String,
//     instagram: String,
//     youtube: String
// });

// const projectsSchema = new mongoose.Schema({
//     project1Image: String,
//     link1: String,
//     project2Image: String,
//     link2: String,
//     project3Image: String,
//     link3: String,
//     project4Image: String,
//     link4: String
// });

// const Wallname = mongoose.model('Wallname', wallnameSchema);
// const Contact = mongoose.model('Contact', contactSchema);
// const Projects = mongoose.model('Projects', projectsSchema);

// const app = express();

// // Middleware setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors({
//     origin: ["https://3d-front.vercel.app", "https://admindashboard-henna.vercel.app"],
//     methods: ["GET", "POST", "PUT"],
//     credentials: true
// }));

// // Serve static files from the 'textures' directory
// app.use('/textures', express.static(path.join(__dirname, '../public/textures')));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://Denis:decimal@cluster0.yzgehjl.mongodb.net/Dynamic?retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Error connecting to MongoDB:', err));

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = path.join(__dirname, '../public/textures');
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + path.extname(file.originalname);
//         cb(null, `${file.fieldname}-${uniqueSuffix}`);
//     }
// });

// const upload = multer({ storage });

// // Serve index.html at the root
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../3d-portfolio-main', 'index.html'));
// });

// // Serve admin.html at /admin
// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, '3d-backend', 'admin.html'));
// });

// // Route to fetch data as JSON
// app.get('/api/data', async (req, res) => {
//     try {
//         const wallname = await Wallname.findOne();
//         const contact = await Contact.findOne();
//         const projects = await Projects.findOne();
//         res.json({ wallname, contact, projects });
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).send('Server Error');
//     }
// });

// // Route to handle form submission and file uploads
// app.post('/save', upload.fields([
//     { name: 'project1Image' }, 
//     { name: 'project2Image' }, 
//     { name: 'project3Image' },
//     { name: 'project4Image' },
//     { name: 'profile' }
// ]), async (req, res) => {
//     try {
//         const existingWallname = await Wallname.findOne() || {};
//         const existingContact = await Contact.findOne() || {};
//         const existingProjects = await Projects.findOne() || {};

//         const { name, about, email, facebook, tiktok, linkedin, instagram, youtube, link1, link2, link3, link4 } = req.body;

//         const githubBaseURL = 'https://raw.githubusercontent.com/Amponsah-Boahen-Denis/imagesfiles/main/textures/';

//         const profileImage = req.files.profile 
//             ? `${githubBaseURL}${req.files.profile[0].filename}` 
//             : existingWallname.profile;

//         await Wallname.findOneAndUpdate({}, {
//             name: name || existingWallname.name,
//             about: about || existingWallname.about,
//             profile: profileImage || existingWallname.profile
//         }, { upsert: true, new: true });

//         await Contact.findOneAndUpdate({}, {
//             email: email || existingContact.email,
//             facebook: facebook || existingContact.facebook,
//             tiktok: tiktok || existingContact.tiktok,
//             linkedin: linkedin || existingContact.linkedin,
//             instagram: instagram || existingContact.instagram,
//             youtube: youtube || existingContact.youtube
//         }, { upsert: true, new: true });

//         await Projects.findOneAndUpdate({}, {
//             project1Image: req.files.project1Image 
//                 ? `${githubBaseURL}${req.files.project1Image[0].filename}` 
//                 : existingProjects.project1Image,
//             link1: link1 || existingProjects.link1,
//             project2Image: req.files.project2Image 
//                 ? `${githubBaseURL}${req.files.project2Image[0].filename}` 
//                 : existingProjects.project2Image,
//             link2: link2 || existingProjects.link2,
//             project3Image: req.files.project3Image 
//                 ? `${githubBaseURL}${req.files.project3Image[0].filename}` 
//                 : existingProjects.project3Image,
//             link3: link3 || existingProjects.link3,
//             project4Image: req.files.project4Image 
//                 ? `${githubBaseURL}${req.files.project4Image[0].filename}` 
//                 : existingProjects.project4Image,
//             link4: link4 || existingProjects.link4
//         }, { upsert: true, new: true });

//         // Redirect back to the admin dashboard
//         res.redirect('https://admindashboard-henna.vercel.app');
//     } catch (err) {
//         console.error('Error saving data:', err);
//         res.status(500).send('Server Error');
//     }
// });

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



