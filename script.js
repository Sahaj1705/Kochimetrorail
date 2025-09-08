lementById('scan-result');
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