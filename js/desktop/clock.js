export function initClock() {
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        
        // Format options for "Mon 9:41 AM"
        const options = { 
            weekday: 'short', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        };
        
        const timeString = now.toLocaleDateString('en-US', options)
                             .replace(/,/g, ''); // Remove commas
                             
        clockElement.textContent = timeString;
    }

    // Initial call
    updateClock();
    
    // Update every minute (could do every second, but minute is enough for this format)
    setInterval(updateClock, 1000);
}
