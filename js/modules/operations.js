/**
 * Operations Management Module
 * Handles schedule management, staff management, and operational planning
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

class OperationsModule {
    constructor() {
        this.schedules = new Map();
        this.staff = new Map();
        this.isInitialized = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.loadStaff = this.loadStaff.bind(this);
    }

    /**
     * Initialize the operations module
     */
    async init() {
        try {
            this.setupEventListeners();
            await this.loadInitialData();
            
            this.isInitialized = true;
            this.logInfo('Operations module initialized');
        } catch (error) {
            this.logError('Failed to initialize operations module:', error);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Schedule management
        const addScheduleBtn = document.getElementById('add-schedule-btn');
        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', this.handleAddSchedule.bind(this));
        }

        // Staff management
        const addStaffBtn = document.getElementById('add-staff-btn');
        if (addStaffBtn) {
            addStaffBtn.addEventListener('click', this.handleAddStaff.bind(this));
        }

        // Filter changes
        const scheduleRoute = document.getElementById('schedule-route');
        if (scheduleRoute) {
            scheduleRoute.addEventListener('change', this.handleRouteFilter.bind(this));
        }

        const scheduleDay = document.getElementById('schedule-day');
        if (scheduleDay) {
            scheduleDay.addEventListener('change', this.handleDayFilter.bind(this));
        }
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadSchedules(),
                this.loadStaff()
            ]);
        } catch (error) {
            this.logError('Failed to load initial operations data:', error);
        }
    }

    /**
     * Load schedule data
     */
    async loadSchedules() {
        try {
            // Simulate API call
            await this.delay(1000);
            
            const mockSchedules = this.generateMockSchedules();
            mockSchedules.forEach(schedule => {
                this.schedules.set(schedule.id, schedule);
            });
            
            this.renderScheduleTable();
            
        } catch (error) {
            this.logError('Failed to load schedules:', error);
        }
    }

    /**
     * Generate mock schedule data
     */
    generateMockSchedules() {
        const schedules = [];
        const routes = ['aluva-pettah', 'pettah-aluva'];
        const statuses = ['active', 'inactive', 'maintenance'];
        
        for (let i = 1; i <= 20; i++) {
            const route = routes[i % 2];
            const departureTime = this.generateRandomTime();
            const arrivalTime = this.addMinutesToTime(departureTime, 45 + Math.random() * 15);
            
            schedules.push({
                id: `SCH-${i.toString().padStart(3, '0')}`,
                trainId: `KM-${i.toString().padStart(3, '0')}`,
                route: route,
                departure: departureTime,
                arrival: arrivalTime,
                frequency: '15 min',
                status: statuses[Math.floor(Math.random() * statuses.length)],
                dayType: Math.random() > 0.7 ? 'weekend' : 'weekday'
            });
        }
        
        return schedules;
    }

    /**
     * Render schedule table
     */
    renderScheduleTable() {
        const tableBody = document.getElementById('schedule-table-body');
        if (!tableBody) return;

        const schedules = Array.from(this.schedules.values());
        const filteredSchedules = this.filterSchedules(schedules);

        tableBody.innerHTML = '';

        filteredSchedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${schedule.trainId}</td>
                <td>${this.formatRoute(schedule.route)}</td>
                <td>${schedule.departure}</td>
                <td>${schedule.arrival}</td>
                <td>${schedule.frequency}</td>
                <td>
                    <span class="status-badge ${schedule.status}">
                        ${this.capitalizeFirst(schedule.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-info" onclick="editSchedule('${schedule.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small btn-secondary" onclick="deleteSchedule('${schedule.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Filter schedules based on current filters
     */
    filterSchedules(schedules) {
        const routeFilter = document.getElementById('schedule-route')?.value || 'all';
        const dayFilter = document.getElementById('schedule-day')?.value || 'weekday';

        return schedules.filter(schedule => {
            const routeMatch = routeFilter === 'all' || schedule.route === routeFilter;
            const dayMatch = dayFilter === 'all' || schedule.dayType === dayFilter;
            return routeMatch && dayMatch;
        });
    }

    /**
     * Load staff data
     */
    async loadStaff() {
        try {
            // Simulate API call
            await this.delay(800);
            
            const mockStaff = this.generateMockStaff();
            mockStaff.forEach(member => {
                this.staff.set(member.id, member);
            });
            
            this.renderStaffList();
            this.updateStaffStats();
            
        } catch (error) {
            this.logError('Failed to load staff:', error);
        }
    }

    /**
     * Generate mock staff data
     */
    generateMockStaff() {
        const staff = [];
        const departments = ['Operations', 'Maintenance', 'Security', 'Customer Service'];
        const shifts = ['Morning', 'Afternoon', 'Night'];
        const statuses = ['on-duty', 'off-duty', 'break'];
        
        const names = [
            'Rajesh Kumar', 'Priya Nair', 'Suresh Menon', 'Lakshmi Pillai',
            'Arun Krishnan', 'Deepa Thomas', 'Vinod Raj', 'Sita Devi',
            'Manoj George', 'Kavitha Nair', 'Ravi Varma', 'Geetha Kumari'
        ];
        
        for (let i = 0; i < 248; i++) {
            const name = names[i % names.length] + ` ${Math.floor(i / names.length) + 1}`;
            staff.push({
                id: `EMP-${i.toString().padStart(4, '0')}`,
                name: name,
                department: departments[Math.floor(Math.random() * departments.length)],
                shift: shifts[Math.floor(Math.random() * shifts.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                station: CONSTANTS.METRO.STATIONS[Math.floor(Math.random() * CONSTANTS.METRO.STATIONS.length)].name,
                joinDate: this.generateRandomDate()
            });
        }
        
        return staff;
    }

    /**
     * Render staff list
     */
    renderStaffList() {
        const staffList = document.getElementById('staff-list');
        if (!staffList) return;

        const staff = Array.from(this.staff.values()).slice(0, 20); // Show first 20 for demo

        staffList.innerHTML = `
            <div class="staff-grid">
                ${staff.map(member => `
                    <div class="staff-card">
                        <div class="staff-header">
                            <div class="staff-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="staff-info">
                                <h4>${member.name}</h4>
                                <p>${member.department}</p>
                            </div>
                            <div class="staff-status ${member.status}">
                                ${this.capitalizeFirst(member.status.replace('-', ' '))}
                            </div>
                        </div>
                        <div class="staff-details">
                            <div class="detail-row">
                                <span>Shift:</span>
                                <strong>${member.shift}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Station:</span>
                                <strong>${member.station}</strong>
                            </div>
                            <div class="detail-row">
                                <span>ID:</span>
                                <strong>${member.id}</strong>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Update staff statistics
     */
    updateStaffStats() {
        const staff = Array.from(this.staff.values());
        const onDuty = staff.filter(member => member.status === 'on-duty').length;
        const offDuty = staff.filter(member => member.status === 'off-duty').length;
        const total = staff.length;

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = total;
            statCards[1].textContent = onDuty;
            statCards[2].textContent = offDuty;
        }
    }

    /**
     * Event handlers
     */
    handleAddSchedule() {
        if (window.toast) {
            window.toast.show('Add Schedule functionality will be implemented', 'info');
        }
    }

    handleAddStaff() {
        if (window.toast) {
            window.toast.show('Add Staff functionality will be implemented', 'info');
        }
    }

    handleRouteFilter() {
        this.renderScheduleTable();
    }

    handleDayFilter() {
        this.renderScheduleTable();
    }

    /**
     * Utility methods
     */
    generateRandomTime() {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    addMinutesToTime(time, minutes) {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMins = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }

    generateRandomDate() {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    formatRoute(route) {
        return route.split('-').map(part => this.capitalizeFirst(part)).join(' → ');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Module lifecycle methods
     */
    onActivate() {
        if (this.isInitialized) {
            this.refreshData();
        }
    }

    onDeactivate() {
        // Cleanup any active processes
    }

    refreshData() {
        // Refresh data if needed
    }

    logInfo(message, ...args) {
        if (CONSTANTS.DEBUG_MODE) {
            console.log(`[OperationsModule] ${message}`, ...args);
        }
    }

    logError(message, ...args) {
        console.error(`[OperationsModule] ${message}`, ...args);
    }

    /**
     * Cleanup method
     */
    destroy() {
        this.schedules.clear();
        this.staff.clear();
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperationsModule;
}