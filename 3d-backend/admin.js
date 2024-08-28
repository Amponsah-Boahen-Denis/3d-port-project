// document.addEventListener('DOMContentLoaded', () => {
//     // Fetch data from the server
//     fetch('https://back-api-mu.vercel.app/api/data')
//         .then(response => response.json())
//         .then(data => {
//             const { wallname, contact, projects } = data;

//             // Populate Wallname fields
//             if (wallname) {
//                 document.getElementById('name').value = wallname.name || '';
//                 document.getElementById('about').value = wallname.about || '';
//                 if (wallname.profile) {
//                     document.getElementById('profilePreview').src = `https://back-api-mu.vercel.app${wallname.profile}`;
//                 }
//             }

//             // Populate Contact fields
//             if (contact) {
//                 document.getElementById('email').value = contact.email || '';
//                 document.getElementById('facebook').value = contact.facebook || '';
//                 document.getElementById('tiktok').value = contact.tiktok || '';
//                 document.getElementById('linkedin').value = contact.linkedin || '';
//                 document.getElementById('instagram').value = contact.instagram || '';
//                 document.getElementById('youtube').value = contact.youtube || '';
//             }

//             // Populate Projects fields
//             if (projects) {
//                 document.getElementById('link1').value = projects.link1 || '';
//                 document.getElementById('link2').value = projects.link2 || '';
//                 document.getElementById('link3').value = projects.link3 || '';
//                 document.getElementById('link4').value = projects.link4 || '';

//                 if (projects.project1Image) {
//                     document.getElementById('project1Preview').src = `https://back-api-mu.vercel.app${projects.project1Image}`;
//                 }
//                 if (projects.project2Image) {
//                     document.getElementById('project2Preview').src = `https://back-api-mu.vercel.app${projects.project2Image}`;
//                 }
//                 if (projects.project3Image) {
//                     document.getElementById('project3Preview').src = `https://back-api-mu.vercel.app${projects.project3Image}`;
//                 }
//                 if (projects.project4Image) {
//                     document.getElementById('project4Preview').src = `https://back-api-mu.vercel.app${projects.project4Image}`;
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// });

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('https://back-api-mu.vercel.app/api/data')
        .then(response => response.json())
        .then(data => {
            const { wallname, contact, projects } = data;

            // Base URL for images stored in the GitHub repository
            const githubBaseURL = 'https://raw.githubusercontent.com/Amponsah-Boahen-Denis/imagesfiles/main/textures/';

            // Populate Wallname fields
            if (wallname) {
                document.getElementById('name').value = wallname.name || '';
                document.getElementById('about').value = wallname.about || '';
                if (wallname.profile) {
                    document.getElementById('profilePreview').src = wallname.profile.startsWith('/textures/')
                        ? `${githubBaseURL}${wallname.profile.split('/').pop()}`
                        : `https://back-api-mu.vercel.app${wallname.profile}`;
                }
            }

            // Populate Contact fields
            if (contact) {
                document.getElementById('email').value = contact.email || '';
                document.getElementById('facebook').value = contact.facebook || '';
                document.getElementById('tiktok').value = contact.tiktok || '';
                document.getElementById('linkedin').value = contact.linkedin || '';
                document.getElementById('instagram').value = contact.instagram || '';
                document.getElementById('youtube').value = contact.youtube || '';
            }

            // Populate Projects fields
            if (projects) {
                document.getElementById('link1').value = projects.link1 || '';
                document.getElementById('link2').value = projects.link2 || '';
                document.getElementById('link3').value = projects.link3 || '';
                document.getElementById('link4').value = projects.link4 || '';

                if (projects.project1Image) {
                    document.getElementById('project1Preview').src = projects.project1Image.startsWith('/textures/')
                        ? `${githubBaseURL}${projects.project1Image.split('/').pop()}`
                        : `https://back-api-mu.vercel.app${projects.project1Image}`;
                }
                if (projects.project2Image) {
                    document.getElementById('project2Preview').src = projects.project2Image.startsWith('/textures/')
                        ? `${githubBaseURL}${projects.project2Image.split('/').pop()}`
                        : `https://back-api-mu.vercel.app${projects.project2Image}`;
                }
                if (projects.project3Image) {
                    document.getElementById('project3Preview').src = projects.project3Image.startsWith('/textures/')
                        ? `${githubBaseURL}${projects.project3Image.split('/').pop()}`
                        : `https://back-api-mu.vercel.app${projects.project3Image}`;
                }
                if (projects.project4Image) {
                    document.getElementById('project4Preview').src = projects.project4Image.startsWith('/textures/')
                        ? `${githubBaseURL}${projects.project4Image.split('/').pop()}`
                        : `https://back-api-mu.vercel.app${projects.project4Image}`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
