let currentUser = null;
let currentPage = 'login';
let selectedRating = 0;

// checking a website
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});


function initializeApp() {
    loadFeedback();
    setupEventListeners();
    showPage('login');
}

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Feedback form
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
    
    // Navi buttons
    document.getElementById('navFeedback').addEventListener('click', () => showPage('feedback'));
    document.getElementById('navDashboard').addEventListener('click', () => showPage('dashboard'));
    document.getElementById('navAbout').addEventListener('click', () => showPage('about'));
    document.getElementById('navLogout').addEventListener('click', handleLogout);
    
    // star rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', handleStarClick);
    });
}

// login 
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('loginError');
    
    // chinecheck if may nakalagay
    if (!username || !password) {
        errorElement.textContent = 'Please fill in both username and password';
        errorElement.style.display = 'block';
        return;
    }
    
    // checking if admid account 
    if (username === '24-0601' && password === '2004') {
        currentUser = { role: 'admin', username: username };
        setupNavigation('admin');
        showPage('dashboard');
    } else {
        currentUser = { role: 'user', username: username };
        setupNavigation('user');
        showPage('feedback');
    }
    
    // clear login form
    document.getElementById('loginForm').reset();
    errorElement.style.display = 'none';
}

// setups ng mga roles
function setupNavigation(role) {
    const navbar = document.getElementById('navbar');
    const adminBadge = document.getElementById('adminBadge');
    const navFeedback = document.getElementById('navFeedback');
    const navDashboard = document.getElementById('navDashboard');
    const navAbout = document.getElementById('navAbout');
    
    // Show navbar
    navbar.style.display = 'block';
    
    // inaassign ung mga roles
    if (role === 'admin') {
        adminBadge.style.display = 'inline-block';
        navFeedback.style.display = 'none';
        navDashboard.style.display = 'inline-block';
        navAbout.style.display = 'inline-block';
    } else {
        adminBadge.style.display = 'none';
        navFeedback.style.display = 'inline-block';
        navDashboard.style.display = 'none';
        navAbout.style.display = 'inline-block';
    }
}

// taga handle ng Logout
function handleLogout() {
    currentUser = null;
    currentPage = 'login';
    document.getElementById('navbar').style.display = 'none';
    showPage('login');
    
    // Reset all nav buttons
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Show Page
function showPage(pageName) {
    // tinatago lahat ng page
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('feedbackPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';
    
    // select page lang
    document.getElementById(pageName + 'Page').style.display = 'block';
    
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (pageName === 'feedback') {
        document.getElementById('navFeedback').classList.add('active');
    } else if (pageName === 'dashboard') {
        document.getElementById('navDashboard').classList.add('active');
        loadFeedback();
    } else if (pageName === 'about') {
        document.getElementById('navAbout').classList.add('active');
    }
    
    currentPage = pageName;
}

// updating stars clicks
function handleStarClick(e) {
    const rating = parseInt(e.target.getAttribute('data-rating'));
    selectedRating = rating;
    document.getElementById('rating').value = rating;
    
    // update stars color
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// feedback submit codesss
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const facility = document.getElementById('facility').value;
    const description = document.getElementById('description').value.trim();
    const rating = selectedRating;
    
    // chinecheck if may unfilled box
    if (!facility || !description || rating === 0) {
        alert('Please fill in all fields and provide a rating');
        return;
    }
    
    // feedback object
    const feedback = {
        id: Date.now().toString(),
        facility: facility,
        description: description,
        rating: rating,
        date: new Date().toLocaleDateString()
    };
    
    // save feedback
    saveFeedback(feedback);
    
    // message sa taas
    alert('Feedback submitted successfully!');
    
    // reset form
    document.getElementById('feedbackForm').reset();
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
}

// Sinisave ung feedback sa localstorage
function saveFeedback(feedback) {
    let feedbackList = JSON.parse(localStorage.getItem('schoolFeedback')) || [];
    feedbackList.push(feedback);
    localStorage.setItem('schoolFeedback', JSON.stringify(feedbackList));
}

// tinatransfer ung feedback galing local
function loadFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem('schoolFeedback')) || [];
    const tableBody = document.getElementById('feedbackTableBody');
    const noFeedbackMessage = document.getElementById('noFeedbackMessage');
    const tableWrapper = document.getElementById('tableWrapper');
    const totalCount = document.getElementById('totalCount');
    
    // clear table
    tableBody.innerHTML = '';
    
    // update ng feedback counter
    totalCount.textContent = feedbackList.length;
    
    if (feedbackList.length === 0) {
        noFeedbackMessage.style.display = 'block';
        tableWrapper.style.display = 'none';
    } else {
        noFeedbackMessage.style.display = 'none';
        tableWrapper.style.display = 'block';
        
        // pang add row
        feedbackList.forEach(feedback => {
            const row = document.createElement('tr');
            
            // star ratings ito
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= feedback.rating) {
                    starsHTML += '<span style="color: #fbbf24;">★</span>';
                } else {
                    starsHTML += '<span style="color: #cbd5e0;">★</span>';
                }
            }
            
            row.innerHTML = `
                <td>${feedback.date}</td>
                <td>${feedback.facility}</td>
                <td>${feedback.description}</td>
                <td>${starsHTML}</td>
                <td>
                    <button class="btn btn-delete" onclick="deleteFeedback('${feedback.id}')">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// codes sa delete feedback
function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        let feedbackList = JSON.parse(localStorage.getItem('schoolFeedback')) || [];
        feedbackList = feedbackList.filter(feedback => feedback.id !== id);
        localStorage.setItem('schoolFeedback', JSON.stringify(feedbackList));
        loadFeedback();
    }
}
