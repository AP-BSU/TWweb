// File: browser.listener.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. INJECT NETWORK POPUP (The "Plug-and-Play" Fix) ---
    // This creates the visual alert box automatically so you don't need to edit HTML/CSS
    if (!document.getElementById('network-popup')) {
        // 1. Inject Styles
        const style = document.createElement('style');
        style.innerHTML = `
            #network-popup {
                position: fixed;
                top: -100px;
                left: 0;
                width: 100%;
                background-color: #eb3b5a;
                color: #ffffff;
                text-align: center;
                padding: 16px;
                font-weight: bold;
                font-family: sans-serif;
                letter-spacing: 1px;
                z-index: 20000;
                transition: top 0.4s ease-in-out;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            #network-popup.show { top: 0; }
            #network-popup.online { background-color: #20bf6b; }
        `;
        document.head.appendChild(style);

        // 2. Inject HTML Element
        const popupDiv = document.createElement('div');
        popupDiv.id = 'network-popup';
        popupDiv.innerText = '⚠️ Internet Connection Lost';
        document.body.appendChild(popupDiv);
    }

    const API_BASE = 'http://localhost:3000/users';

    // --- 1. TRACK VISIT ON LOAD ---
    fetch(`${API_BASE}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            type: 'visit', 
            detail: 'homepage_load' 
        })
    }).catch(err => console.log('Tracking error:', err));


    // --- 2. TRACK SECTION CLICKS ---
    const sectionLinks = document.querySelectorAll('#main .tiles .link');
    sectionLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionName = link.innerText.trim();
            fetch(`${API_BASE}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true, 
                body: JSON.stringify({ 
                    type: 'click', 
                    detail: sectionName 
                })
            });
        });
    });

    // --- 3. HANDLE FEEDBACK FORM SUBMISSION ---
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            fetch(`${API_BASE}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: name,
                    email: email, 
                    message: message 
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you! Submission successful.');
                    contactForm.reset(); 
                } else {
                    alert('Error. Please try again.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Server seems offline.');
            });
        });
    }

    // --- 4. NETWORK STATUS MONITOR ---
    // Now we can safely find the element because we created it in Step 0
    const popup = document.getElementById('network-popup');

    const updateNetworkStatus = () => {
        if (!popup) return;

        if (navigator.onLine) {
            // User is Back Online
            popup.innerText = "Connection Online";
            popup.classList.add('online'); 
            
            setTimeout(() => {
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.classList.remove('online');
                    popup.innerText = "Connection Lost";
                }, 500);
            }, 3000);

        } else {
            // User is Offline
            popup.innerText = "Connection Lost";
            popup.classList.remove('online'); 
            popup.classList.add('show'); 
        }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

});