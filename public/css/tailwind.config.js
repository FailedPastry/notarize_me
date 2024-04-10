/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {},
    },
    plugins: [],
  }

  /** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    // ...
  }

  // tailwind.config.js

module.exports = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          darkBlue: '#141F6D',
          lightBlue: '#668CC2',
        },
      },
    },
    // Other Tailwind CSS configurations...
  };
  // tailwind.config.js

module.exports = {
    darkMode: 'class', // Enable dark mode
    // Other Tailwind CSS configurations...
  };
  // tailwind.config.js

module.exports = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          darkBlue: '#141F6D', // Custom dark blue color
          lightBlue: '#668CC2', // Custom light blue color
        },
      },
    },
    // Other Tailwind CSS configurations...
  };