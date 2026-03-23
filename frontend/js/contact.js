// Contact form submission logic
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const msgBanner = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Set loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.innerText;
            
            btnText.innerHTML = 'Sending... <span class="loading-spinner"></span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            msgBanner.className = 'form-message-banner'; // reset classes
            msgBanner.style.display = 'none';

            // Gather data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                // Using FormSubmit API to successfully deliver to your email immediately
                const apiUrl = 'https://formsubmit.co/ajax/nishantchauhan1084@gmail.com';
                               
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && (result.success === "true" || result.success === true)) {
                    // Success
                    msgBanner.innerText = "Message Sent! ✓ I will respond within 24 hours.";
                    msgBanner.classList.add('success');
                    submitBtn.style.background = '#22c55e'; // Green
                    btnText.innerText = 'Sent Successfully';
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.style.background = '';
                        btnText.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                    }, 4000);
                } else {
                    // Handled Server Error
                    throw new Error(result.message || "Failed to send message.");
                }
            } catch (error) {
                // Catch network Error or thrown error
                msgBanner.innerText = error.message || "Oops! Network error. Please try again.";
                msgBanner.classList.add('error');
                btnText.innerText = 'Try Again';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                setTimeout(() => { btnText.innerText = originalText; }, 3000);
            }
        });
    }
});
