// Global variables
let currentSlide = 0;
let slideInterval;
let currentTab = 'dashboard';
let currentScanMode = 'auth';
let currentVerifyTrain = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeSlideshow();
    initializeNavigation();
    initializeModals();
    initializeNotifications();
    initializeTrainOperations();
    initializeLiveMap();
    initializeVerifyOperations();
    updateCurrentTime();
    
    // Update time every minute
    setInterval(updateCurrentTime, 60000);
}

// Slideshow Functions
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (slides.length === 0) return;
    
    // Auto-rotate slides
    slideInterval = setInterval(nextSlide, 6000);
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 6000);
        });
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlideshow();
}

function updateSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Navigation Functions
function initializeNavigation() {
    // Desktop navigation
    const navItems = document.querySelectorAll('.nav-item');
    const navDropdownItems = document.querySelectorAll('.nav-dropdown-item');
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    
    // Mobile navigation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    // Quick access items
    const quickAccessItems = document.querySelectorAll('.quick-access-item');
    
    // Desktop nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = item.getAttribute('data-tab');
            if (tab && tab !== 'operations' && tab !== 'management') {
                switchTab(tab);
                closeAllDropdowns();
            }
        });
    });
    
    // Dropdown items
    navDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = item.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
                closeAllDropdowns();
            }
        });
    });
    
    // Dropdown toggles
    navDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.nav-item');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('show');
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('show');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }
    
    // Mobile nav items
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
                mobileNav.classList.remove('show');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    });
    
    // Quick access items
    quickAccessItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', closeAllDropdowns);
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update navigation active states
    updateNavActiveStates(tabName);
    
    currentTab = tabName;
}

function updateNavActiveStates(activeTab) {
    // Desktop navigation
    const navItems = document.querySelectorAll('.nav-item');
    const navDropdownItems = document.querySelectorAll('.nav-dropdown-item');
    
    navItems.forEach(item => {
        const tab = item.getAttribute('data-tab');
        item.classList.toggle('active', tab === activeTab);
    });
    
    navDropdownItems.forEach(item => {
        const tab = item.getAttribute('data-tab');
        item.classList.toggle('active', tab === activeTab);
    });
    
    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        const tab = item.getAttribute('data-tab');
        item.classList.toggle('active', tab === activeTab);
    });
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Modal Functions
function initializeModals() {
    // QR Scanner Modal
    const qrBtn = document.getElementById('qr-scanner-btn');
    const qrModal = document.getElementById('qr-modal');
    const qrModalClose = document.getElementById('qr-modal-close');
    const closeScanner = document.getElementById('close-scanner');
    const simulateScan = document.getElementById('simulate-scan');
    const processScan = document.getElementById('process-scan');
    const scanModes = document.querySelectorAll('.scan-mode');
    
    if (qrBtn) qrBtn.addEventListener('click', () => showModal('qr-modal'));
    if (qrModalClose) qrModalClose.addEventListener('click', () => hideModal('qr-modal'));
    if (closeScanner) closeScanner.addEventListener('click', () => hideModal('qr-modal'));
    
    if (simulateScan) {
        simulateScan.addEventListener('click', () => {
            const mockData = {
                auth: 'EMP001-RAVI-KUMAR-STATION-MASTER',
                incident: 'INC-2024-001-PLATFORM-SAFETY-ISSUE',
                train: 'TRAIN-K-101-STATUS-RUNNING-DRIVER-RAJESH'
            };
            
            const scanResult = document.getElementById('scan-result');
            const scanData = document.getElementById('scan-data');
            
            if (scanResult && scanData) {
                scanData.textContent = mockData[currentScanMode];
                scanResult.style.display = 'block';
                processScan.style.display = 'block';
            }
        });
    }
    
    if (processScan) {
        processScan.addEventListener('click', () => {
            hideModal('qr-modal');
            // Reset scan result
            const scanResult = document.getElementById('scan-result');
            if (scanResult) {
                scanResult.style.display = 'none';
                processScan.style.display = 'none';
            }
        });
    }
    
    scanModes.forEach(mode => {
        mode.addEventListener('click', () => {
            scanModes.forEach(m => m.classList.remove('active'));
            mode.classList.add('active');
            currentScanMode = mode.getAttribute('data-mode');
        });
    });
    
    // Verification Modal
    const verificationModal = document.getElementById('verification-modal');
    const verificationModalClose = document.getElementById('verification-modal-close');
    const cancelVerification = document.getElementById('cancel-verification');
    const confirmVerification = document.getElementById('confirm-verification');
    
    if (verificationModalClose) verificationModalClose.addEventListener('click', () => hideModal('verification-modal'));
    if (cancelVerification) cancelVerification.addEventListener('click', () => hideModal('verification-modal'));
    
    if (confirmVerification) {
        confirmVerification.addEventListener('click', () => {
            hideModal('verification-modal');
            showSuccessMessage('Operations verified successfully!');
        });
    }
    
    // Add Train Modal
    const addTrainBtn = document.getElementById('add-train-btn');
    const addTrainModal = document.getElementById('add-train-modal');
    const addTrainModalClose = document.getElementById('add-train-modal-close');
    const cancelAddTrain = document.getElementById('cancel-add-train');
    const submitTrain = document.getElementById('submit-train');
    
    if (addTrainBtn) addTrainBtn.addEventListener('click', () => showModal('add-train-modal'));
    if (addTrainModalClose) addTrainModalClose.addEventListener('click', () => hideModal('add-train-modal'));
    if (cancelAddTrain) cancelAddTrain.addEventListener('click', () => hideModal('add-train-modal'));
    
    if (submitTrain) {
        submitTrain.addEventListener('click', () => {
            const trainId = document.getElementById('train-id').value;
            const trainDriver = document.getElementById('train-driver').value;
            const trainRoute = document.getElementById('train-route').value;
            
            if (trainId && trainDriver && trainRoute) {
                hideModal('add-train-modal');
                showSuccessMessage(`Train ${trainId} added successfully!`);
                // Reset form
                document.getElementById('add-train-form').reset();
            }
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Notification Functions
function initializeNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const refreshBtn = document.getElementById('refresh-btn');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Animate refresh button
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = '';
            }, 500);
            
            showSuccessMessage('Dashboard refreshed successfully!');
        });
    }
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', () => {
        if (notificationDropdown) {
            notificationDropdown.classList.remove('show');
        }
    });
}

// Train Operations Functions
function initializeTrainOperations() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const trainSearch = document.getElementById('train-search');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterTrains(filter);
        });
    });
    
    if (trainSearch) {
        trainSearch.addEventListener('input', (e) => {
            searchTrains(e.target.value);
        });
    }
}

function filterTrains(filter) {
    const trainItems = document.querySelectorAll('.train-item');
    
    trainItems.forEach(item => {
        const status = item.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchTrains(searchTerm) {
    const trainItems = document.querySelectorAll('.train-item');
    const term = searchTerm.toLowerCase();
    
    trainItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Live Map Functions
function initializeLiveMap() {
    const stations = document.querySelectorAll('.station');
    const stationDetails = document.getElementById('station-details');
    
    stations.forEach(station => {
        station.addEventListener('click', () => {
            const stationName = station.getAttribute('data-station');
            showStationDetails(stationName);
        });
    });
}

function showStationDetails(stationName) {
    const stationDetails = document.getElementById('station-details');
    const noSelection = stationDetails.querySelector('.no-selection');
    const stationInfo = stationDetails.querySelector('.station-info');
    const selectedStationName = document.getElementById('selected-station-name');
    const stationOfficers = document.getElementById('station-officers');
    const stationTrains = document.getElementById('station-trains');
    
    if (noSelection) noSelection.style.display = 'none';
    if (stationInfo) stationInfo.style.display = 'block';
    if (selectedStationName) selectedStationName.textContent = stationName;
    
    // Mock data for demonstration
    const mockData = {
        'Aluva': { officers: 3, trains: 0 },
        'Kalamassery': { officers: 4, trains: 1 },
        'Edapally': { officers: 3, trains: 1 },
        'MG Road': { officers: 4, trains: 1 }
    };
    
    const data = mockData[stationName] || { officers: 2, trains: 0 };
    
    if (stationOfficers) stationOfficers.textContent = data.officers;
    if (stationTrains) stationTrains.textContent = data.trains;
}

// Verify Operations Functions
function initializeVerifyOperations() {
    const verifyBtns = document.querySelectorAll('.btn-verify');
    
    verifyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const trainId = btn.getAttribute('data-train');
            showVerificationModal(trainId);
        });
    });
}

function showVerificationModal(trainId) {
    currentVerifyTrain = trainId;
    const verifyTrainId = document.getElementById('verify-train-id');
    if (verifyTrainId) {
        verifyTrainId.textContent = trainId;
    }
    showModal('verification-modal');
}

// Utility Functions
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleString();
    }
}

function showSuccessMessage(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update train positions (in a real app, this would come from an API)
        const trains = document.querySelectorAll('.train');
        trains.forEach(train => {
            // Randomly update train positions slightly
            const currentLeft = parseInt(train.style.left);
            const currentTop = parseInt(train.style.top);
            
            // Small random movement to simulate real-time updates
            const newLeft = currentLeft + (Math.random() - 0.5) * 2;
            const newTop = currentTop + (Math.random() - 0.5) * 2;
            
            train.style.left = `${Math.max(0, newLeft)}px`;
            train.style.top = `${Math.max(0, newTop)}px`;
        });
    }, 10000); // Update every 10 seconds
}

// Initialize real-time updates
setTimeout(simulateRealTimeUpdates, 5000);