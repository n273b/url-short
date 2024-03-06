document.addEventListener('DOMContentLoaded', function() {
    const refreshLink = document.getElementById('refresh_link');
    
    if (refreshLink) {
        // Check if the page is being refreshed
        const isRefreshed = performance.navigation.type === 1;
        
        // If the page is refreshed, set the value of short_url to an empty string
        if (isRefreshed) {
            refreshLink.setAttribute('href', '');
            refreshLink.textContent = ''; // Optional: clear the text content as well

            const clickMeElement = document.querySelector('.click_me');
            if (clickMeElement) {
                clickMeElement.textContent = ''; // Set the text content to empty string
            }
        }
        
        // Add click event listener to the refreshLink
        refreshLink.addEventListener('click', (e) => {
            e.preventDefault();
        
            const href = refreshLink.getAttribute('href');
        
            // Open the link in a new window/tab
            window.open(href, '_blank');
        
            // Reload the current page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Adjust the delay as needed
        });
    }
})