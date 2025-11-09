// GitHub-style Profile Page Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    if (!user.username) {
        window.location.href = 'register.html';
        return;
    }

    // Initialize profile
    loadUserProfile();
    generateUserAvatar();
    loadStatistics();
    loadHackerStats();
    loadActivity();
    loadAchievements();
    initializeTabs();
    initializeEditProfile();
    initializeModals();
});

// Load user profile data
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    
    // Set username
    const usernameEl = document.getElementById('profileUsername');
    if (usernameEl) {
        usernameEl.textContent = user.username || 'user';
    }

    // Set bio
    const bioEl = document.getElementById('profileBio');
    if (bioEl) {
        bioEl.textContent = user.bio || 'Hacker • Security Researcher • Darknet Enthusiast';
    }

    // Set location
    const locationEl = document.getElementById('profileLocation');
    if (locationEl) {
        locationEl.textContent = `📍 Location: ${user.location || 'Hidden'}`;
    }

    // Set email
    const emailEl = document.getElementById('profileEmail');
    if (emailEl) {
        emailEl.textContent = `✉️ Email: ${user.email ? user.email.split('@')[0] + '@darkweb.local' : 'hidden@darkweb.local'}`;
    }

    // Set joined date
    const joinedEl = document.getElementById('profileJoined');
    if (joinedEl && user.joinDate) {
        const date = new Date(user.joinDate);
        joinedEl.textContent = `Joined on ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } else if (joinedEl) {
        joinedEl.textContent = 'Joined on Jan 2023';
    }

    // Set rank
    const rankEl = document.getElementById('overviewRank');
    if (rankEl) {
        rankEl.textContent = user.rank || 'NEWBIE';
    }

    // Set skills
    if (user.skills && user.skills.length > 0) {
        const skillsList = document.getElementById('skillsList');
        if (skillsList) {
            skillsList.innerHTML = user.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        }
    }
}

// Generate user avatar
function generateUserAvatar() {
    if (typeof HackerAvatarGenerator !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
        const username = user.username || 'user';
        const generator = new HackerAvatarGenerator();
        
        const avatarContainer = document.getElementById('profileAvatar');
        if (avatarContainer) {
            const avatarSVG = generator.generateMatrixAvatar(username, 160);
            avatarContainer.innerHTML = avatarSVG;
        }
    } else {
        // Load avatar generator
        const script = document.createElement('script');
        script.src = '../js/avatar-generator.js';
        script.onload = () => {
            generateUserAvatar();
        };
        document.head.appendChild(script);
    }
}

// Load statistics
function loadStatistics() {
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    
    // Reputation
    const reputation = user.reputation || 0;
    updateStat('statReputation', reputation);
    updateStat('overviewReputation', reputation);

    // Activity (days since join)
    const joinDate = user.joinDate ? new Date(user.joinDate) : new Date();
    const daysActive = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
    updateStat('statActivity', daysActive);
    updateStat('overviewActivity', daysActive);
}

// Load hacker stats
function loadHackerStats() {
    let hackerStats = JSON.parse(localStorage.getItem('hacker_stats') || '{}');
    
    // Initialize if empty
    if (!hackerStats.exploits) hackerStats.exploits = Math.floor(Math.random() * 100) + 10;
    if (!hackerStats.servers) hackerStats.servers = Math.floor(Math.random() * 50) + 5;
    if (!hackerStats.databases) hackerStats.databases = Math.floor(Math.random() * 30) + 3;
    if (!hackerStats.zeroDays) hackerStats.zeroDays = Math.floor(Math.random() * 5) + 1;
    
    localStorage.setItem('hacker_stats', JSON.stringify(hackerStats));
    
    // Update stats
    updateStat('statExploits', hackerStats.exploits);
    updateStat('statServers', hackerStats.servers);
    updateStat('statDatabases', hackerStats.databases);
    updateStat('statZeroDays', hackerStats.zeroDays);
}

// Update stat element
function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

// Load activity
function loadActivity() {
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    const timeline = document.getElementById('activityTimeline');
    const feed = document.getElementById('activityFeed');
    
    if (timeline) {
        // Show last 5 activities in timeline
        const recentActivities = activities.slice(-5).reverse();
        timeline.innerHTML = recentActivities.map(activity => {
            const time = formatTime(activity.time);
            const icon = getActivityIcon(activity.type);
            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.message || activity.type}</div>
                        <div class="activity-time">${time} ago</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (feed) {
        // Show all activities in feed
        feed.innerHTML = activities.slice().reverse().map(activity => {
            const time = formatTime(activity.time);
            const icon = getActivityIcon(activity.type);
            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.message || activity.type}</div>
                        <div class="activity-time">${time} ago</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Load contribution graph
    loadContributionGraph();
}

// Load contribution graph
function loadContributionGraph() {
    const graph = document.getElementById('contributionGraph');
    if (!graph) return;

    // Generate a simple contribution graph
    const weeks = 52;
    const daysPerWeek = 7;
    let html = '<div style="display: flex; gap: 2px; flex-wrap: wrap; justify-content: center;">';
    
    for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < daysPerWeek; day++) {
            const intensity = Math.floor(Math.random() * 4);
            const color = intensity === 0 ? '#161b22' : 
                         intensity === 1 ? '#0e4429' : 
                         intensity === 2 ? '#006d32' : '#00ff41';
            html += `<div style="width: 10px; height: 10px; background: ${color}; border-radius: 2px;" title="Contributions"></div>`;
        }
    }
    
    html += '</div>';
    graph.innerHTML = html;
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'login': '🔐',
        'logout': '🚪',
        'purchase': '💳',
        'sale': '💰',
        'message': '💬',
        'profile': '👤',
        'settings': '⚙️',
        'achievement': '🏆'
    };
    return icons[type] || '📝';
}

// Load achievements
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    const grid = document.getElementById('achievementsGrid');
    
    if (grid && achievements.length > 0) {
        grid.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `).join('');
    }
}

// Initialize tabs
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            link.classList.add('active');
            const tabName = link.getAttribute('data-tab');
            const tabContent = document.getElementById(tabName + 'Tab');
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Load tab content
    loadRepositories();
    loadProjects();
    loadPackages();
    loadStars();
}

// Load repositories
function loadRepositories() {
    const reposList = document.getElementById('repositoriesList');
    if (!reposList) return;

    const repos = JSON.parse(localStorage.getItem('user_repositories') || '[]');
    
    if (repos.length === 0) {
        reposList.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b949e;">No repositories yet</div>';
    } else {
        reposList.innerHTML = repos.map(repo => `
            <div class="repository-item">
                <div>
                    <div class="repository-name">${repo.name}</div>
                    <div class="repository-description">${repo.description || 'No description'}</div>
                </div>
            </div>
        `).join('');
    }
}

// Load projects
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projects = JSON.parse(localStorage.getItem('user_projects') || '[]');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b949e; grid-column: 1 / -1;">No projects yet</div>';
    } else {
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-title">${project.name}</div>
                <div class="project-description">${project.description || 'No description'}</div>
            </div>
        `).join('');
    }
}

// Load packages
function loadPackages() {
    const packagesList = document.getElementById('packagesList');
    if (!packagesList) return;

    packagesList.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b949e;">No packages yet</div>';
}

// Load stars
function loadStars() {
    const starsList = document.getElementById('starsList');
    if (!starsList) return;

    starsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b949e;">No stars yet</div>';
}

// Initialize edit profile
function initializeEditProfile() {
    const editBtn = document.getElementById('editProfileBtn');
    const modal = document.getElementById('editProfileModal');
    const form = document.getElementById('editProfileForm');
    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (editBtn && modal) {
        editBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            
            // Fill form with current data
            const editUsername = document.getElementById('editUsername');
            const editBio = document.getElementById('editBio');
            const editLocation = document.getElementById('editLocation');
            const editEmail = document.getElementById('editEmail');
            const editSkills = document.getElementById('editSkills');
            
            if (editUsername) editUsername.value = user.username || '';
            if (editBio) editBio.value = user.bio || '';
            if (editLocation) editLocation.value = user.location || '';
            if (editEmail) editEmail.value = user.email || '';
            if (editSkills) editSkills.value = user.skills ? user.skills.join(', ') : '';
            
            modal.classList.add('active');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            
            const editUsername = document.getElementById('editUsername');
            const editBio = document.getElementById('editBio');
            const editLocation = document.getElementById('editLocation');
            const editEmail = document.getElementById('editEmail');
            const editSkills = document.getElementById('editSkills');
            
            if (editUsername) user.username = editUsername.value;
            if (editBio) user.bio = editBio.value;
            if (editLocation) user.location = editLocation.value;
            if (editEmail) user.email = editEmail.value;
            if (editSkills) {
                user.skills = editSkills.value.split(',').map(s => s.trim()).filter(s => s);
            }
            
            // Update all users
            const allUsers = JSON.parse(localStorage.getItem('darknet_users') || '[]');
            const userIndex = allUsers.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                allUsers[userIndex] = { ...allUsers[userIndex], ...user };
                localStorage.setItem('darknet_users', JSON.stringify(allUsers));
            }
            
            localStorage.setItem('darknet_user', JSON.stringify(user));
            
            // Reload profile
            loadUserProfile();
            generateUserAvatar();
            
            // Add activity
            addActivity('profile', 'Profile updated');
            
            // Close modal
            modal.classList.remove('active');
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification('Profile updated successfully', 'success');
            }
        });
    }
}

// Initialize modals
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Format time
function formatTime(timeString) {
    const time = new Date(timeString);
    const now = new Date();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'just now';
}

// Add activity (if function exists in common.js)
if (typeof addActivity === 'undefined') {
    function addActivity(type, message) {
        const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
        activities.push({
            type: type,
            message: message,
            time: new Date().toISOString()
        });
        
        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.shift();
        }
        
        localStorage.setItem('user_activity', JSON.stringify(activities));
        loadActivity();
    }
    window.addActivity = addActivity;
}
