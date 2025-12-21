document.addEventListener('DOMContentLoaded', () => {
    
    // NOTE: path must be relative path.
    const API_BASE = '/api/users'; 

    // Fetches the Stat Counts
    fetch(`${API_BASE}/stats`)
        .then(res => res.json())
        .then(data => {
            const update = (id, val) => {
                const el = document.getElementById(id);
                if(el) el.innerText = val;
            };
            
            // Standard Updates
            update('visit-count', data.totalVisits);
            update('click-count', data.totalClicks);
            update('feedback-count', data.totalFeedbacks); 

            // Unique User Display
            const userCard = document.getElementById('user-count');
            if(userCard) {
                userCard.innerHTML = `
                    ${data.totalUsers} <span style="font-size: 0.6em; font-weight:normal;">(Accounts)</span><br>
                    <span style="font-size: 0.6em; font-weight:normal;">${data.uniqueNames} Unique Names</span>
                `;
            }

            // Server Status
            const serverStatus = document.getElementById('server-status');
            if(serverStatus) {
                serverStatus.innerText = "Online";
                serverStatus.style.color = "#20bf6b"; // Its alive!
            }
        })
        .catch(() => {
            const serverStatus = document.getElementById('server-status');
            if(serverStatus) {
                serverStatus.innerText = "Offline";
                serverStatus.style.color = "#eb3b5a"; // Offline indicator
            }
        });

    // Fetch the Feedback List
    fetch(`${API_BASE}/feedback`) 
        .then(res => res.json())
        .then(feedbacks => {
            const container = document.getElementById('feedback-list-container');
            if (!container) return;

            container.innerHTML = ''; 

            if (feedbacks.length === 0) {
                container.innerHTML = '<p style="text-align:center;">No feedback received yet.</p>';
                return;
            }

            feedbacks.forEach(item => {
                
                const name = item.name || "Unknown";
                const email = item.email || "Unknown";
                const message = item.message || "No content";
                
                // Fallback and creates a temporary date if MongoDB fails
                const dateStr = new Date().toLocaleDateString(); 

                const card = document.createElement('div');
                card.className = 'feedback-card';
                card.innerHTML = `
                    <div class="feedback-date">${dateStr}</div>
                    <div class="feedback-info">
                        <div><strong>Name:</strong> ${name}</div>
                        <div><strong>Email:</strong> ${email}</div>
                    </div>
                    <div class="feedback-content-label">Content:</div>
                    <div class="feedback-message">"${message}"</div>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => console.log("Error loading feedback list:", err));
        
    // Embed Status Check
    const embedStatus = document.getElementById('embed-status');
    if(embedStatus) {
        embedStatus.innerText = navigator.onLine ? "Active" : "Unreachable";
        embedStatus.style.color = navigator.onLine ? "#20bf6b" : "#eb3b5a";
    }

    // UNSPLASH (Moved from app.js)

    // This runs the image fetching safely in the browser  
    fetchFreshIcon('technology', 'server-status'); // Finds a tech photo for the server card
    fetchFreshIcon('meeting', 'visit-count');      // Finds a meeting photo for visits

});

// Function for Unsplash with Dynamic Queries
async function fetchFreshIcon(query, elementId) {
    const accessKey = 'pXhwzz1JtQU'; // Public API key
    const endpoint = `https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`; 
    // Note: Adjusted endpoint to 'random' which is usually better for single image fetch

    try {
        // Fetches Unsplash for data
        const response = await fetch(endpoint);
        const data = await response.json();

        // Unpacks JSON objects
        // We only need the specific image URL "small" or "regular".
        const imageUrl = data.urls.small; 
        const photographer = data.user.name; // Attribution is legally required by Unsplash

        // Inject it into the specified element
        const container = document.getElementById(elementId);
        const imgElement = container ? container.querySelector('img') : null;
        
        if (imgElement) {
            imgElement.src = imageUrl;
            imgElement.alt = `Photo by ${photographer}`;
        } else if (container) {
            // Fallback: If no <img> tag
            // container.style.backgroundImage = `url(${imageUrl})`;
        }

    } catch (error) {
        console.error("Unsplash API Error:", error);
        // Fallback handled in HTML usually
    }
}
