// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('[x-data="{ show: true }"]');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  });
});
