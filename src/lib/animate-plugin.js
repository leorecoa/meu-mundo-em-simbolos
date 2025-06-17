// Custom animation plugin to replace tailwindcss-animate
module.exports = function({ addUtilities, matchUtilities, theme }) {
  // Add basic animation utilities
  addUtilities({
    '.animate-accordion-down': {
      animation: 'accordion-down 0.2s ease-out'
    },
    '.animate-accordion-up': {
      animation: 'accordion-up 0.2s ease-out'
    },
    '.animate-fade-in': {
      animation: 'fade-in 0.2s ease-out'
    },
    '.animate-fade-out': {
      animation: 'fade-out 0.2s ease-out'
    },
    '.animate-slide-in-right': {
      animation: 'slide-in-right 0.2s ease-out'
    },
    '.animate-slide-out-right': {
      animation: 'slide-out-right 0.2s ease-out'
    }
  });

  // Add additional keyframes to the global CSS
  const styles = `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slide-in-right {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes slide-out-right {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `;

  // Inject the keyframes into the CSS
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
};