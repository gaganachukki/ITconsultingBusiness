/**
 * FORM VALIDATION UTILITIES (validation.js)
 */

const Validator = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPhone(phone) {
    const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,}$/;
    return re.test(String(phone).trim());
  },

  isNotEmpty(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
  },

  showError(inputElement, message) {
    this.clearError(inputElement);
    inputElement.classList.add('input-error');
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error-msg';
    errorEl.textContent = message;
    errorEl.style.color = '#ef4444';
    errorEl.style.fontSize = '0.75rem';
    errorEl.style.marginTop = '4px';
    inputElement.parentNode.appendChild(errorEl);
  },

  clearError(inputElement) {
    inputElement.classList.remove('input-error');
    const existing = inputElement.parentNode.querySelector('.field-error-msg');
    if (existing) {
      existing.remove();
    }
  }
};
