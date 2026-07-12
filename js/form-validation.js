document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quote-form');
    
    if (!form) return;

    // Auto-select product from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    if (productParam) {
        const productSelect = document.getElementById('product');
        if (productSelect) {
            // Find option with matching value
            for (let i = 0; i < productSelect.options.length; i++) {
                if (productSelect.options[i].value === productParam) {
                    productSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    const successMessage = document.getElementById('form-success');

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const showError = (inputId) => {
        const errorDiv = document.getElementById(`${inputId}-error`);
        if (errorDiv) errorDiv.classList.add('visible');
    };

    const hideErrors = () => {
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        hideErrors();

        let isValid = true;

        // Required text fields
        const requiredFields = ['name', 'company', 'phone', 'message'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                showError(field);
                isValid = false;
            }
        });

        // Email validation
        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            showError('email');
            isValid = false;
        }

        // Dropdown validation
        const productSelect = document.getElementById('product');
        if (!productSelect.value) {
            showError('product');
            isValid = false;
        }

        // File size validation (max 10MB)
        const fileInput = document.getElementById('attachment');
        if (fileInput.files.length > 0) {
            const fileSize = fileInput.files[0].size;
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (fileSize > maxSize) {
                showError('attachment');
                isValid = false;
            }
        }

        // If valid, submit form via fetch to prevent redirect and show success message
        if (isValid) {
            // Disable submit button to prevent double submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(form);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Success
                    form.reset();
                    successMessage.classList.add('visible');
                    // Scroll to top of form to see success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Reset product dropdown back to default (since form.reset() might not trigger perfectly on all browsers if set via JS)
                    document.getElementById('product').selectedIndex = 0;
                } else {
                    console.log(response);
                    const generalError = document.getElementById('form-error-general');
                    if(generalError) generalError.classList.add('visible');
                }
            })
            .catch(error => {
                console.log(error);
                const generalError = document.getElementById('form-error-general');
                if(generalError) generalError.classList.add('visible');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        }
    });
});
