/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        red: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffcccc",
          300: "#ff9999",
          400: "#ff6666",
          500: "#ff3333",
          600: "#ff1a1a",
          700: "#e60000",
          800: "#cc0000",
          900: "#990000"
        },
        brand: {
          DEFAULT: "#ff1a1a",
          300: "#ff6666",
          400: "#ff3333",
          500: "#ff1a1a",
          600: "#e60000",
          700: "#990000",
          red: "#ff1a1a",
          "red-dark": "#cc0000",
          "red-light": "#ff6666",
          black: "#000000",
          "black-dark": "#0f0f0f",
          "black-mid": "#1a1a1a",
          "black-light": "#2d2d2d"
        }
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "red-glow": "0 0 20px rgba(255, 26, 26, 0.5)",
        "red-glow-lg": "0 0 40px rgba(255, 26, 26, 0.6)",
        "red-glow-sm": "0 0 10px rgba(255, 26, 26, 0.4)",
        panel: "0 20px 60px rgba(0, 0, 0, 0.35)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4)",
        "neumorphic": "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 26, 26, 0.1)"
      },
      borderColor: {
        "red-glow": "rgba(255, 26, 26, 0.5)"
      },
      animation: {
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite"
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 26, 26, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 26, 26, 0.8)" }
        },
        "slide-up": {
          "from": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "to": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in": {
          "from": { opacity: "0" },
          "to": { opacity: "1" }
        },
        "scale-in": {
          "from": {
            opacity: "0",
            transform: "scale(0.95)"
          },
          "to": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        }
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px"
      }
    }
  },
  plugins: []
};
