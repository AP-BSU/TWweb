// APIs

(function() {
    // --- 1. CONFIGURATION (Runs Immediately) ---
    // We define the API URL here so it can be used below
    const API_BASE = 'http://localhost:3000/users'; 

    // Initialize EmailJS immediately if the library is loaded
    if (window.emailjs) {
        emailjs.init("nnrzGym76bTtHhajW"); // Public API Key
        console.log("EmailJS Initialized");
    } else {
        console.error("EmailJS library not found."); // Check your HTML script order if error.
    }

    // --- 2. LOGIC (Waits for HTML to be ready) ---
    // We must wait for the page to load before looking for the form
    document.addEventListener('DOMContentLoaded', () => {
        
        const contactForm = document.querySelector('form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                
                // --- FUTURE RECAPTCHA BLOCK (Uncomment when you have a Site Key) ---
                /*
                const captchaResponse = grecaptcha.getResponse();
                if (captchaResponse.length === 0) {
                    alert("Please verify that you are not a robot.");
                    return; 
                }
                grecaptcha.reset(); // Reset after check
                */
                // ------------------------------------------------------------------

                const name = document.getElementById('name').value;                
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                const submitBtn = contactForm.querySelector('input[type="submit"]');

                // Visual Feedback
                submitBtn.value = "Sending...";
                submitBtn.disabled = true;

                // A. SEND EMAIL (Via EmailJS)
                const emailParams = {
                    from_name: name,
                    reply_to: email,
                    message: message
                };

                // Replace with your actual Service ID and Template ID
                emailjs.send('service_6y18s1f', 'template_itxcxdj', emailParams)
                    .then(() => {
                        console.log('Verification Succesful');
                    })
                    .catch((error) => {
                        console.error('Verification failed', error);
                    });

                // B. SAVE TO DATABASE (Via your Backend)
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
                        alert('Thank you! Your feedback has been sent.');
                        contactForm.reset(); 
                    } else {
                        alert('Error');
                    }
                })
                .catch(() => alert('EmailJS is not responding.'))
                .finally(() => {
                    submitBtn.value = "Send Message";
                    submitBtn.disabled = false;
                });
            });
        }
    });

})();