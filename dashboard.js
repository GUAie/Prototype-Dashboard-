
// User Profile Data
let userProfile = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "+63 912 345 6789",
    householdSize: 4,
    region: "NCR",
    province: "Metro Manila",
    city: "Quezon City",
    zipCode: "1100",
    electricityProvider: "Meralco",
    electricityTariff: 11.00,
    currency: "PHP",
    energyUnit: "kWh",
    carbonUnit: "kg",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    darkMode: false,
    joinDate: "January 2024"
};

// Sample data for demonstration
let appliances = [
    { id: 1, name: "Electric Fan", wattage: 75, usageHours: 8, category: "bedroom" },
    { id: 2, name: "Refrigerator", wattage: 150, usageHours: 24, category: "kitchen" },
    { id: 3, name: "LED TV", wattage: 100, usageHours: 4, category: "living-room" },
    { id: 4, name: "Rice Cooker", wattage: 700, usageHours: 1, category: "kitchen" },
    { id: 5, name: "Air Conditioner", wattage: 1000, usageHours: 6, category: "bedroom" }
];

let goals = [
    { id: 1, type: "consumption", period: "monthly", target: 300, current: 195, unit: "kWh" },
    { id: 2, type: "cost", period: "monthly", target: 3300, current: 2145, unit: "₱" }
];

// Enhanced Notification System
let notifications = [
    { 
        id: 1, 
        type: 'info', 
        title: 'Welcome to Energy Saving Pro', 
        message: 'Start tracking your energy consumption to save money and reduce your carbon footprint.', 
        timestamp: new Date('2024-01-15T08:00:00'),
        read: false 
    },
    { 
        id: 2, 
        type: 'warning', 
        title: 'High Energy Usage Detected', 
        message: 'Your energy consumption is 25% higher than your weekly average. Consider reducing appliance usage during peak hours.', 
        timestamp: new Date('2024-01-20T14:30:00'),
        read: false 
    },
    { 
        id: 3, 
        type: 'success', 
        title: 'Goal Achieved!', 
        message: 'Congratulations! You have achieved your monthly energy saving goal of 300 kWh.', 
        timestamp: new Date('2024-01-18T10:15:00'),
        read: true 
    },
    { 
        id: 4, 
        type: 'info', 
        title: 'Peak Hours Alert', 
        message: 'Peak electricity rates are currently active (2:00 PM - 6:00 PM). Consider reducing usage to save money.', 
        timestamp: new Date('2024-01-21T15:45:00'),
        read: false 
    }
];

// Dark Mode Functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial state
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Add event listener
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
            showToast('Dark mode enabled', 'info');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
            showToast('Dark mode disabled', 'info');
        }
    });
}

// Update user profile to sync with dark mode toggle
function updateDarkModePreference() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    userProfile.darkMode = darkModeToggle.checked;
    
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadAppliances();
    loadGoals();
    populateApplianceSelect();
    loadUserProfile();
    updateProfileSummary();
    initializeNotificationSystem();
    initializeDarkMode();
});

// Initialize notification system
function initializeNotificationSystem() {
    updateInboxCounter();
    loadNotifications();
    
    // Make inbox clickable
    const inbox = document.querySelector('.inbox');
    if (inbox) {
        inbox.addEventListener('click', openNotificationModal);
    }
}

// Update inbox counter
function updateInboxCounter() {
    const inboxCount = document.querySelector('.inbox-count');
    const unreadBadge = document.querySelector('.unread-badge');
    const unreadCount = notifications.filter(notification => !notification.read).length;
    
    if (inboxCount) {
        inboxCount.textContent = notifications.length;
    }
    
    // Create or update unread badge
    if (unreadCount > 0) {
        if (!unreadBadge) {
            const badge = document.createElement('div');
            badge.className = 'unread-badge';
            document.querySelector('.inbox').appendChild(badge);
        }
        document.querySelector('.unread-badge').textContent = unreadCount;
    } else if (unreadBadge) {
        unreadBadge.remove();
    }
}

// Load notifications into modal
function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const emptyNotifications = document.getElementById('emptyNotifications');
    
    if (notifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyNotifications.style.display = 'block';
        return;
    }
    
    notificationsList.style.display = 'block';
    emptyNotifications.style.display = 'none';
    notificationsList.innerHTML = '';
    
    // Sort notifications by timestamp (newest first)
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedNotifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
        notificationItem.onclick = () => markAsRead(notification.id);
        
        const icon = getNotificationIcon(notification.type);
        const timeAgo = getTimeAgo(notification.timestamp);
        
        notificationItem.innerHTML = `
            <div class="notification-icon ${notification.type}">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${timeAgo}</div>
                <div class="notification-actions-single">
                    <button class="btn-delete-notification" onclick="event.stopPropagation(); deleteNotification(${notification.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        notificationsList.appendChild(notificationItem);
    });
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        warning: '⚠️',
        success: '✅',
        error: '❌'
    };
    return icons[type] || '🔔';
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const diffMs = now - new Date(timestamp);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
}

// Modal functions
function openNotificationModal() {
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'block';
    loadNotifications();
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'none';
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('notificationModal');
    if (event.target === modal) {
        closeNotificationModal();
    }
}

// Notification actions
function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        updateInboxCounter();
        loadNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    updateInboxCounter();
    loadNotifications();
    showToast('All notifications marked as read', 'success');
}

function deleteNotification(notificationId) {
    notifications = notifications.filter(notification => notification.id !== notificationId);
    updateInboxCounter();
    loadNotifications();
    showToast('Notification deleted', 'success');
}

function clearAllNotifications() {
    if (notifications.length === 0) {
        showToast('No notifications to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        updateInboxCounter();
        loadNotifications();
        showToast('All notifications cleared', 'success');
    }
}

// Add new notification
function addNotification(type, title, message) {
    const newNotification = {
        id: Date.now(), // Simple ID generation
        type: type,
        title: title,
        message: message,
        timestamp: new Date(),
        read: false
    };
    
    notifications.unshift(newNotification); // Add to beginning
    updateInboxCounter();
    
    // Reload if modal is open
    if (document.getElementById('notificationModal').style.display === 'block') {
        loadNotifications();
    }
    
    // Show toast notification
    showToast('New notification received', 'info');
}

// Enhanced toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <span>${getNotificationIcon(type)}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Update the existing showNotification function to use the new system
function showNotification(message, type = 'info') {
    const titles = {
        info: 'Information',
        success: 'Success',
        error: 'Error',
        warning: 'Warning'
    };
    
    addNotification(type, titles[type] || 'Notification', message);
}

// Update test notification functions
function testBudgetAlert() {
    addNotification('warning', 'Budget Limit Alert', 'You are approaching your monthly budget limit! Current spending: ₱2,800 of ₱3,300');
    if (Notification.permission === 'granted') {
        new Notification('Energy Saving Pro - Budget Alert', {
            body: 'You are approaching your monthly budget limit! Current spending: ₱2,800 of ₱3,300',
            icon: '/icon.png'
        });
    }
}

function testSpikeAlert() {
    addNotification('warning', 'Usage Spike Detected', 'Unusual energy consumption detected! 45% higher than average.');
    if (Notification.permission === 'granted') {
        new Notification('Energy Saving Pro - Usage Spike', {
            body: 'Unusual energy consumption detected! 45% higher than average.',
            icon: '/icon.png'
        });
    }
}

function testPeakHoursAlert() {
    addNotification('info', 'Peak Hours Alert', 'Peak electricity rates are active now (2:00 PM - 6:00 PM). Consider reducing usage.');
    if (Notification.permission === 'granted') {
        new Notification('Energy Saving Pro - Peak Hours Alert', {
            body: 'Peak electricity rates are active now (2:00 PM - 6:00 PM). Consider reducing usage.',
            icon: '/icon.png'
        });
    }
}

// Load user profile data into forms
function loadUserProfile() {
    // Personal Information
    document.getElementById('fullName').value = userProfile.name;
    document.getElementById('userEmail').value = userProfile.email;
    document.getElementById('phoneNumber').value = userProfile.phone;
    document.getElementById('householdSize').value = userProfile.householdSize;

    // Location & Tariff
    document.getElementById('region').value = userProfile.region;
    document.getElementById('province').value = userProfile.province;
    document.getElementById('city').value = userProfile.city;
    document.getElementById('zipCode').value = userProfile.zipCode;
    document.getElementById('electricityProvider').value = userProfile.electricityProvider;
    document.getElementById('electricityTariff').value = userProfile.electricityTariff;
    document.getElementById('currency').value = userProfile.currency;
    document.getElementById('tariffRate').value = userProfile.electricityTariff;

    // Preferences
    document.getElementById('energyUnit').value = userProfile.energyUnit;
    document.getElementById('carbonUnit').value = userProfile.carbonUnit;
    document.getElementById('timeFormat').value = userProfile.timeFormat;
    document.getElementById('dateFormat').value = userProfile.dateFormat;

    // Initialize dark mode
    initializeDarkMode();
    
    // Update header
    document.getElementById('userName').textContent = userProfile.name;
    document.getElementById('userLocation').textContent = `${userProfile.city}, ${userProfile.region}`;
    
    // Update current cost
    updateCurrentCost();
}

function updateProfileSummary() {
    document.getElementById('summaryName').textContent = userProfile.name;
    document.getElementById('summaryLocation').textContent = `${userProfile.city}, ${userProfile.province}`;
    document.getElementById('summaryProvider').textContent = userProfile.electricityProvider;
    document.getElementById('summaryTariff').textContent = `₱${userProfile.electricityTariff.toFixed(2)}/kWh`;
    document.getElementById('summaryHousehold').textContent = `${userProfile.householdSize} people`;
    document.getElementById('summaryJoinDate').textContent = userProfile.joinDate;
}

function updateCurrentCost() {
    const dailyConsumption = 8.5; // Sample data
    const dailyCost = dailyConsumption * userProfile.electricityTariff;
    document.getElementById('currentCost').textContent = `₱${dailyCost.toFixed(2)}`;
}

// Chart Initialization
function initializeCharts() {
    // Weekly Energy Consumption Chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Energy Consumption (kWh)',
                data: [7.2, 8.1, 9.5, 8.8, 7.9, 10.2, 8.5],
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kWh'
                    }
                }
            }
        }
    });

    // Appliance Usage Breakdown Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    new Chart(usageCtx, {
        type: 'pie',
        data: {
            labels: ['Air Conditioner', 'Refrigerator', 'Electric Fan', 'Rice Cooker', 'LED TV', 'Others'],
            datasets: [{
                data: [35, 25, 15, 12, 8, 5],
                backgroundColor: [
                    '#4CAF50',
                    '#388E3C',
                    '#81C784',
                    '#C8E6C9',
                    '#E8F5E9',
                    '#A5D6A7'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Form Submission Handlers
document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userProfile.name = document.getElementById('fullName').value;
    userProfile.email = document.getElementById('userEmail').value;
    userProfile.phone = document.getElementById('phoneNumber').value;
    userProfile.householdSize = parseInt(document.getElementById('householdSize').value);
    
    updateProfileSummary();
    document.getElementById('userName').textContent = userProfile.name;
    showNotification('Personal information updated successfully!', 'success');
});

document.getElementById('locationTariffForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userProfile.region = document.getElementById('region').value;
    userProfile.province = document.getElementById('province').value;
    userProfile.city = document.getElementById('city').value;
    userProfile.zipCode = document.getElementById('zipCode').value;
    userProfile.electricityProvider = document.getElementById('electricityProvider').value;
    userProfile.electricityTariff = parseFloat(document.getElementById('electricityTariff').value);
    userProfile.currency = document.getElementById('currency').value;
    
    // Update tariff rate in cost calculator
    document.getElementById('tariffRate').value = userProfile.electricityTariff;
    
    updateProfileSummary();
    updateCurrentCost();
    document.getElementById('userLocation').textContent = `${userProfile.city}, ${userProfile.region}`;
    showNotification('Location and tariff settings updated successfully!', 'success');
});

document.getElementById('preferencesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userProfile.energyUnit = document.getElementById('energyUnit').value;
    userProfile.carbonUnit = document.getElementById('carbonUnit').value;
    userProfile.timeFormat = document.getElementById('timeFormat').value;
    userProfile.dateFormat = document.getElementById('dateFormat').value;
    
    // Sync dark mode toggle with preference
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.checked = userProfile.darkMode;
    updateDarkModePreference();
    
    showNotification('Application preferences saved successfully!', 'success');
});

// Appliance Management
function loadAppliances() {
    const container = document.getElementById('appliancesContainer');
    container.innerHTML = '';

    appliances.forEach(appliance => {
        const dailyConsumption = (appliance.wattage * appliance.usageHours) / 1000;
        const dailyCost = dailyConsumption * userProfile.electricityTariff;
        const card = document.createElement('div');
        card.className = 'appliance-card';
        card.innerHTML = `
            <div class="appliance-header">
                <div class="appliance-name">${appliance.name}</div>
                <div class="appliance-actions">
                    <button class="action-btn" onclick="editAppliance(${appliance.id})">✏️</button>
                    <button class="action-btn" onclick="deleteAppliance(${appliance.id})">🗑️</button>
                </div>
            </div>
            <div class="appliance-details">
                <div>Wattage: ${appliance.wattage}W</div>
                <div>Usage: ${appliance.usageHours}h/day</div>
                <div>Consumption: ${dailyConsumption.toFixed(2)} kWh/day</div>
                <div>Cost: ₱${dailyCost.toFixed(2)}/day</div>
                <div>Category: ${appliance.category}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addAppliance(event) {
    event.preventDefault();
    
    const name = document.getElementById('applianceName').value;
    const wattage = parseInt(document.getElementById('wattage').value);
    const usageHours = parseFloat(document.getElementById('usageHours').value);
    const category = document.getElementById('category').value;

    const newAppliance = {
        id: appliances.length + 1,
        name,
        wattage,
        usageHours,
        category
    };

    appliances.push(newAppliance);
    loadAppliances();
    populateApplianceSelect();
    document.getElementById('addApplianceForm').reset();
    
    showNotification('Appliance added successfully!', 'success');
}

function editAppliance(id) {
    const appliance = appliances.find(a => a.id === id);
    if (appliance) {
        document.getElementById('applianceName').value = appliance.name;
        document.getElementById('wattage').value = appliance.wattage;
        document.getElementById('usageHours').value = appliance.usageHours;
        document.getElementById('category').value = appliance.category;
        
        // Remove the appliance and update form for editing
        deleteAppliance(id);
        showNotification('Edit the appliance details below', 'info');
    }
}

function deleteAppliance(id) {
    appliances = appliances.filter(a => a.id !== id);
    loadAppliances();
    populateApplianceSelect();
    showNotification('Appliance deleted successfully!', 'success');
}

function populateApplianceSelect() {
    const select = document.getElementById('scenarioAppliance');
    select.innerHTML = '<option value="">Select an appliance</option>';
    
    appliances.forEach(appliance => {
        const option = document.createElement('option');
        option.value = appliance.id;
        option.textContent = appliance.name;
        select.appendChild(option);
    });
}

// Carbon Calculator
function calculateCarbon() {
    const consumption = parseFloat(document.getElementById('energyConsumption').value) || 0;
    const emissionFactor = 0.5; // kg CO₂ per kWh (PH grid average)
    const carbonEmissions = consumption * emissionFactor;
    
    document.getElementById('carbonResult').textContent = carbonEmissions.toFixed(2);
    showNotification(`Carbon footprint calculated: ${carbonEmissions.toFixed(2)} kg CO₂`, 'success');
}

// Cost Calculator
function calculateBill() {
    const reading = parseFloat(document.getElementById('meterReading').value) || 0;
    const tariff = parseFloat(document.getElementById('tariffRate').value) || userProfile.electricityTariff;
    const bill = reading * tariff;
    
    document.getElementById('billResult').textContent = `₱${bill.toFixed(2)}`;
    showNotification(`Estimated bill: ₱${bill.toFixed(2)}`, 'success');
}

function calculateScenario() {
    const applianceId = document.getElementById('scenarioAppliance').value;
    const hours = parseFloat(document.getElementById('scenarioHours').value) || 0;
    const tariff = parseFloat(document.getElementById('tariffRate').value) || userProfile.electricityTariff;
    
    if (!applianceId) {
        showNotification('Please select an appliance', 'error');
        return;
    }
    
    const appliance = appliances.find(a => a.id == applianceId);
    if (appliance) {
        const dailyConsumption = (appliance.wattage * hours) / 1000;
        const dailyCost = dailyConsumption * tariff;
        const monthlyCost = dailyCost * 30;
        const dailyCarbon = dailyConsumption * 0.5; // kg CO₂
        
        document.getElementById('scenarioCost').textContent = `₱${dailyCost.toFixed(2)}`;
        document.getElementById('scenarioCostMonthly').textContent = `₱${monthlyCost.toFixed(2)}`;
        document.getElementById('scenarioCarbon').textContent = `${dailyCarbon.toFixed(2)} kg`;
        
        showNotification(`Scenario calculated for ${appliance.name}`, 'success');
    }
}

// Goal Setting
function loadGoals() {
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';

    goals.forEach(goal => {
        const progress = (goal.current / goal.target) * 100;
        const card = document.createElement('div');
        card.className = 'goal-item';
        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-title">${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} ${goal.period} Goal</div>
                <div class="goal-target"> ${goal.unit}${goal.current} / ${goal.unit}${goal.target}\</div>
            </div>
            <div class="goal-progress-bar">
                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <div class="goal-progress-text">${progress.toFixed(1)}% Complete</div>
        `;
        container.appendChild(card);
    });
}

function setGoal(event) {
    event.preventDefault();
    
    const type = document.getElementById('goalType').value;
    const period = document.getElementById('goalPeriod').value;
    const target = parseFloat(document.getElementById('goalTarget').value);

    const unit = type === 'cost' ? '₱' : type === 'carbon' ? 'kg' : 'kWh';
    const current = 0; // Start from zero for new goals

    const newGoal = {
        id: goals.length + 1,
        type,
        period,
        target,
        current,
        unit
    };

    goals.push(newGoal);
    loadGoals();
    document.getElementById('goalForm').reset();
    
    showNotification('New goal set successfully!', 'success');
}

// Logout Function
function logout() {
    showNotification('Logging out...', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Request notification permission on page load
if ('Notification' in window) {
    Notification.requestPermission();
}

// Event Listeners
document.getElementById('addApplianceForm').addEventListener('submit', addAppliance);
document.getElementById('goalForm').addEventListener('submit', setGoal);

// Smooth scrolling for navigation
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});