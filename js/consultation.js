/**
 * CONSULTATION BOOKING MODAL & HANDLER (consultation.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('consultationModal');
  const openBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const form = document.getElementById('consultationForm');

  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('#consultName');
      const emailInput = form.querySelector('#consultEmail');
      const serviceInput = form.querySelector('#consultService');
      let isValid = true;

      if (!Validator.isNotEmpty(nameInput.value)) {
        Validator.showError(nameInput, 'Full name is required');
        isValid = false;
      } else {
        Validator.clearError(nameInput);
      }

      if (!Validator.isValidEmail(emailInput.value)) {
        Validator.showError(emailInput, 'Please provide a valid business email');
        isValid = false;
      } else {
        Validator.clearError(emailInput);
      }

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Scheduling...';
        submitBtn.disabled = true;

        setTimeout(() => {
          form.innerHTML = `
            <div style="text-align: center; padding: 24px 0;">
              <div style="width: 56px; height: 56px; background: #e0f2fe; color: #1c7aec; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="font-size: 1.35rem; color: #011e48; margin-bottom: 8px; font-weight: 800;">Consultation Requested!</h3>
              <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">Thank you, ${nameInput.value}. Our principal IT consultant will reach out within 2 hours to confirm your discovery session.</p>
              <button onclick="document.getElementById('consultationModal').classList.remove('active'); document.body.style.overflow = '';" style="margin-top: 20px; background: #1c7aec; color: #fff; padding: 10px 24px; border-radius: 9999px; font-weight: 700; cursor: pointer;">Close</button>
            </div>
          `;
        }, 1000);
      }
    });
  }
});
