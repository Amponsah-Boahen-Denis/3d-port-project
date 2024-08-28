document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server
    fetch('http://localhost:3000/api/data')
        .then(response => response.json())
        .then(data => {
            const { wallname, contact, projects } = data;

            // Populate Wallname fields
            if (wallname) {
                document.getElementById('name').value = wallname.name || '';
                document.getElementById('about').value = wallname.about || '';
                if (wallname.profile) {
                    document.getElementById('profilePreview').src = `http://localhost:3000/textures/${wallname.profile.split('/').pop()}`;
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
                    document.getElementById('project1Preview').src = `http://localhost:3000/textures/${projects.project1Image.split('/').pop()}`;
                }
                if (projects.project2Image) {
                    document.getElementById('project2Preview').src = `http://localhost:3000/textures/${projects.project2Image.split('/').pop()}`;
                }
                if (projects.project3Image) {
                    document.getElementById('project3Preview').src = `http://localhost:3000/textures/${projects.project3Image.split('/').pop()}`;
                }
                if (projects.project4Image) {
                    document.getElementById('project4Preview').src = `http://localhost:3000/textures/${projects.project4Image.split('/').pop()}`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
