// Predefined course passwords
const coursePasswords = {
    "Basic Tailoring": [
        "basic75", "basic86", "basic05", "basic10", "basic19", "basic20",
        "75basict", "86basict", "05basict", "10basict", "19basict", "20basict",
        "03basic75", "18basic86", "08basic10"
    ],
    "Advanced Tailoring": [
        "advanced75", "advanced86", "advanced05", "advanced10", "advanced19", "advanced20",
        "75advancedt", "86advancedt", "05advancedt", "10advancedt", "19advancedt", "20advancedt",
        "03advanced75", "18advanced86", "08advanced10"
    ],
    "Machine Embroidery": [
        "ME75", "ME86", "ME05", "ME10", "ME19", "ME20",
        "75MEt", "86MEt", "05MEt", "10MEt", "19MEt", "20MEt",
        "03ME75", "18ME86", "08ME10"
    ],
    "Basic Aari": [
        "BA75", "BA86", "BA05", "BA10", "BA19", "BA20",
        "75BAt", "86BAt", "05BAt", "10BAt", "19BAt", "20BAt",
        "03BA75", "18BA86", "08BA10"
    ],
    "Advanced Aari": [
        "AA75", "AA86", "AA05", "AA10", "AA19", "AA20",
        "75AAt", "86AAt", "05AAt", "10AAt", "19AAt", "20AAt",
        "03AA75", "18AA86", "08AA10"
    ]
};

// Active sessions tracking (passwords and their assigned phones)
const activeSessions = {};

// Google Drive video links for each course
const courseVideos = {
    "Basic Tailoring": [
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/19OE2Mz9H_XbLR5wPu3oT_UGvGFkvn-5x?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1amLeAB8G1X3NUe8qoMyR5bjJEa1a--K1?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1a1JYSMG45Rabwa4lRUS8fbpolCPa7hGp?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1dmttrjwcuzP1S1ohQ5fdiYUcuAloy8_b?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1zTUPSve5aNxtP3RSBv_J-Ff_dXuhBocq?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/10z0itf4jt1GjNhllPFXDnqk7xYpjsoCt?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1NN789mR9GIXDzEvJDeoANSNgST4HR2wb?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1_CQo5i44Y6PstFGwFSZ2HFQLLWIU1sKG?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1_mOaR6nfTRP9aZz4oEbHgKIenJ5Re_BA?usp=drive_link&export=view",
        "https://drive.google.com/uc?id=https://drive.google.com/drive/folders/1K4H-yFjMTKBJg_R9mw_LTGTRM4ru5qWv?usp=drive_link&export=view",
    ],
    "Advanced Tailoring": [
        "https://drive.google.com/uc?id=ADVANCED_&export=view",
        "https://drive.google.com/uc?id=ADVANCED_VIDEO_DAY2&export=view"
    ],
    "Machine Embroidery": [
        "https://drive.google.com/uc?id=ME_VIDEO_DAY1&export=view",
        "https://drive.google.com/uc?id=ME_VIDEO_DAY2&export=view"
    ],
    "Basic Aari": [
        "https://drive.google.com/uc?id=BA_VIDEO_DAY1&export=view",
        "https://drive.google.com/uc?id=BA_VIDEO_DAY2&export=view"
    ],
    "Advanced Aari": [
        "https://drive.google.com/uc?id=AA_VIDEO_DAY1&export=view",
        "https://drive.google.com/uc?id=AA_VIDEO_DAY2&export=view"
    ]
};

// Helper function to check password validity and exclusivity
const isPasswordAvailable = (password, phone) => {
    if (activeSessions[password]) {
        const session = activeSessions[password];
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        const now = new Date().getTime();

        // Check if the session has expired
        if (now - session.startDate.getTime() > oneMonthInMs) {
            delete activeSessions[password]; // Free up the password
            return true;
        }

        // Check if the same phone number is using it
        if (session.phone === phone) {
            return true;
        }

        return false; // Password is in use by another user
    }
    return true; // Password is not in use
};

// On login form submission
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    let courseFound = null;

    // Check if the password matches any course
    for (const [course, passwords] of Object.entries(coursePasswords)) {
        if (passwords.includes(password)) {
            courseFound = course;
            break;
        }
    }

    if (courseFound && isPasswordAvailable(password, phone)) {
        // Activate session for the password
        activeSessions[password] = {
            phone,
            startDate: new Date()
        };

        // Save the user’s course and start date for this session
        localStorage.setItem("userCourse", courseFound);
        localStorage.setItem("startDate", new Date().toISOString());

        // Redirect to videos page
        document.getElementById('message').innerText = "Login successful! Redirecting...";
        window.location.href = "videos.html";
    } else {
        document.getElementById('message').innerText =
            "Invalid password or already in use. Please contact us for assistance.";
    }
});

// Handle videos page access
if (window.location.pathname.endsWith("videos.html")) {
    const userCourse = localStorage.getItem("userCourse");
    const startDate = localStorage.getItem("startDate");
    const videosDiv = document.getElementById("videos");

    if (userCourse && startDate) {
        const courseVideosList = courseVideos[userCourse];
        const startDateTime = new Date(startDate).getTime();
        const now = new Date().getTime();
        const daysElapsed = Math.floor((now - startDateTime) / (24 * 60 * 60 * 1000));

        // Unlock videos based on the number of days elapsed
        const unlockedVideos = courseVideosList.slice(0, daysElapsed + 1);

        // Display unlocked videos
        if (unlockedVideos.length > 0) {
            videosDiv.innerHTML = `<h2>Course: ${userCourse}</h2>`;
            unlockedVideos.forEach((videoLink, index) => {
                videosDiv.innerHTML += `
                    <div>
                        <h3>Day ${index + 1} Video</h3>
                        <video controls>
                            <source src="${videoLink}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            });
        } else {
            videosDiv.innerText = "No videos unlocked yet. Please check back tomorrow.";
        }
    } else {
        videosDiv.innerText = "You are not authorized to view this page.";
    }
}
