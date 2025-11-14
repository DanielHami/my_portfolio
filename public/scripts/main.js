// Contact form handling with Netlify
function setupContactForm() {
  const form = document.getElementById('form');
  const result = document.getElementById('result');
  
  if (!form || !result) return;

  // Show message to user
  function showFormMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `form-message p-4 rounded-xl mt-4 text-sm ${
      type === 'success' 
        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
        : type === 'error'
          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    }`;
    messageEl.textContent = message;
    
    // Insert after the form or before the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.parentNode?.insertBefore(messageEl, submitButton.nextSibling);
    } else {
      form.appendChild(messageEl);
    }

    // Auto-hide after 8 seconds for info/error messages
    if (type !== 'success') {
      setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
      }, 8000);
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending...';
    submitButton.classList.add('opacity-75', 'cursor-not-allowed');
    
    // Show temporary message
    showFormMessage('Sending your message...', 'info');
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status == 200) {
        showFormMessage(json.message, 'success');
        form.reset();
      } else {
        console.error('Form submission error:', json);
        showFormMessage(json.message || 'Failed to send message', 'error');
      }
    })
    .catch(error => {
      console.error('Network error:', error);
      showFormMessage('Something went wrong! Please try again later.', 'error');
    })
    .finally(() => {
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form
  setupContactForm();

  // Mobile menu toggle
  const btn = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');
  if (btn && panel) {
    btn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });
  }
  
  // Letter reveal
  const nodes = document.querySelectorAll('[data-letter]');
  nodes.forEach((n, i) => {
    if (n instanceof HTMLElement) {
      setTimeout(() => {
        n.style.transform = 'translateY(0)';
        n.style.opacity = '1';
      }, 120 + i * 120);
    }
  });

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  // Chart.js — Evals
  const el = document.getElementById('evalChart');
  if (el && typeof Chart !== "undefined") {
    const ctx = el.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0.05)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
          datasets: [
            {
              label: 'gpt‑4o‑mini',
              data: [64, 68, 71, 74, 78, 82],
              borderColor: '#ffffff',
              backgroundColor: gradient,
              fill: true,
              tension: 0.35,
              pointRadius: 2,
              borderWidth: 1.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } },
              grid: { color: 'rgba(255,255,255,0.06)' }
            },
            y: {
              suggestedMin: 50,
              suggestedMax: 90,
              ticks: { 
                color: 'rgba(255,255,255,0.7)', 
                font: { size: 11 }, 
                callback: (v) => v + '%' 
              },
              grid: { color: 'rgba(255,255,255,0.06)' }
            }
          }
        }
      });
    }
  }
});
