
document.addEventListener('DOMContentLoaded', function() {
    // Calendar elements
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarDays = document.getElementById('calendar-days');
    const timeSlotsContainer = document.querySelector('.slots-container');
    const currentTimeEl = document.getElementById('current-time');
    
    let currentDate = new Date();
    let selectedDate = null;
    
    // Initialize calendar
    function initCalendar() {
        updateCurrentTime();
        renderCalendar();
        
        // Update time every minute
        setInterval(updateCurrentTime, 60000);
    }
    
    // Update current time display
    function updateCurrentTime() {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    }
    
    // Render calendar month
    function renderCalendar() {
        // Set month and year header
        currentMonthEl.textContent = currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get day of week for first day (0-6 where 0 is Sunday)
        const startDay = firstDay.getDay();
        
        // Get days from previous month
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        // Create days from previous month
        // Fixed error #1: Changed loop condition to prevent infinite loop
        for (let i = (startDay > 0 ? startDay - 1 : 6); i > 0; i--) {
            const day = document.createElement('div');
            day.classList.add('day', 'other-month');
            day.textContent = prevMonthLastDay - i + 1;
            calendarDays.appendChild(day);
        }
        
        // Create days for current month
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day', 'current-month');
            day.textContent = i;
            
            // Mark today
            const today = new Date();
            if (i === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                day.classList.add('today');
            }
            
            // Add click event
            day.addEventListener('click', function() {
                // Fixed error #2: Removed duplicate selectDate declaration
                selectDate(i);
            });
            
            calendarDays.appendChild(day);
        }
        
        // Calculate days needed from next month
        const totalDaysShown = (startDay > 0 ? startDay - 1 : 6) + daysInMonth;
        const daysFromNextMonth = 42 - totalDaysShown; // 6 weeks display
        
        // Create days from next month
        // Fixed error #3: Changed loop to start from 1 instead of 0
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day', 'other-month');
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    // Select a date
    function selectDate(day) {
        // Remove previous selection
        const previouslySelected = document.querySelector('.day.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Add selection to clicked day
        const days = document.querySelectorAll('.day.current-month');
        // Fixed error #4: Added check for days existence
        if (days.length >= day) {
            days[day - 1].classList.add('selected');
            
            // Set selected date
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            // Show time slots for selected date
            showTimeSlots();
        }
    }
    
    // Show available time slots
    function showTimeSlots() {
        // Fixed error #5: Added null check for container
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        // Generate sample time slots
        const startHour = 9;
        const endHour = 17;
        const slotDuration = 30; // minutes
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                
                // Format time
                const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? '00' : minute} ${hour < 12 ? 'am' : 'pm'}`;
                timeSlot.textContent = timeString;
                
                // Randomly mark some slots as booked (demo only)
                if (Math.random() < 0.3) {
                    timeSlot.classList.add('booked');
                    timeSlot.textContent += ' (Booked)';
                } else {
                    // Fixed error #6: Properly scoped timeString in closure
                    timeSlot.addEventListener('click', (function(time) {
                        return function() {
                            bookSlot(time);
                        };
                    })(timeString));
                }
                
                timeSlotsContainer.appendChild(timeSlot);
            }
        }
    }
    
    // Book a time slot
    function bookSlot(time) {
        if (!selectedDate) return;
        
        const dateString = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        
        // Fixed error #7: Changed to template literal
        if (confirm(`Confirm booking for ${dateString} at ${time}?`)) {
            alert(`Demo call booked for ${dateString} at ${time}. Conferencing details will be emailed to you.`);
        }
    }
    
    // Event listeners for month navigation
    // Fixed error #8: Properly attached event listeners
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Initialize the calendar
    // Fixed error #9: Added check for required elements
    if (currentMonthEl && calendarDays) {
        initCalendar();
    }
});
