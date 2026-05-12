/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#00ff88",
          "green-bright": "#00ffaa",
          "green-dim": "#00cc6f",
          blue: "#00d4ff",
          "blue-bright": "#00e8ff",
          "blue-dim": "#00a8cc",
          pink: "#ff00ff",
          "pink-bright": "#ff33ff",
          "pink-dim": "#cc00cc",
          cyan: "#00ffff",
          "cyan-glow": "rgba(0, 255, 255, 0.3)"
        },
        dark: {
          50: "#f9f9f9",
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#d0d0d0",
          400: "#333333",
          500: "#222222",
          600: "#1a1a1a",
          700: "#111111",
          800: "#0a0a0a",
          900: "#000000"
        },
        brand: {
          DEFAULT: "#00ff88",
          green: "#00ff88",
          "green-bright": "#00ffaa",
          "green-dim": "#00cc6f",
          blue: "#00d4ff",
          "blue-bright": "#00e8ff",
          "blue-dim": "#00a8cc",
          pink: "#ff00ff",
          black: "#0a0a0a",
          "black-dark": "#050505",
          "black-mid": "#111111",
          "black-light": "#1a1a1a"
        }
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "neon-glow": "0 0 20px rgba(0, 255, 136, 0.5)",
        "neon-glow-lg": "0 0 50px rgba(0, 255, 136, 0.6), 0 0 80px rgba(0, 212, 255, 0.3)",
        "neon-glow-sm": "0 0 10px rgba(0, 255, 136, 0.4)",
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.5)",
        "neon-blue-lg": "0 0 40px rgba(0, 212, 255, 0.6)",
        "neon-pink": "0 0 20px rgba(255, 0, 255, 0.5)",
        "neon-pink-lg": "0 0 40px rgba(255, 0, 255, 0.6)",
        "red-glow-sm": "0 0 12px rgba(239, 68, 68, 0.35)",
        "red-glow": "0 0 24px rgba(239, 68, 68, 0.45)",
        "red-glow-lg": "0 0 42px rgba(239, 68, 68, 0.55), 0 0 80px rgba(185, 28, 28, 0.28)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        "glass-lg": "0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        "panel": "0 20px 60px rgba(0, 0, 0, 0.7)",
        "panel-elevated": "0 40px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 136, 0.1)",
        "neumorphic": "8px 8px 16px rgba(0, 0, 0, 0.7), -8px -8px 16px rgba(0, 255, 136, 0.05)"
      },
      borderColor: {
        "neon-glow": "rgba(0, 255, 136, 0.3)",
        "neon-blue-glow": "rgba(0, 212, 255, 0.3)",
        "neon-pink-glow": "rgba(255, 0, 255, 0.3)"
      },
      animation: {
        "pulse-neon": "pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glow-pulse-blue": "glow-pulse-blue 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "blur-in": "blur-in 0.8s ease-out"
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 136, 0.8)" }
        },
        "glow-pulse-blue": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.8)" }
        },
        "slide-up": {
          "from": {
            opacity: "0",
            transform: "translateY(30px)"
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
        "fade-in-up": {
          "from": {
            opacity: "0",
            transform: "translateY(40px)",
            filter: "blur(10px)"
          },
          "to": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)"
          }
        },
        "scale-in": {
          "from": {
            opacity: "0",
            transform: "scale(0.9)"
          },
          "to": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" }
        },
        "blur-in": {
          "from": {
            opacity: "0",
            filter: "blur(20px)"
          },
          "to": {
            opacity: "1",
            filter: "blur(0)"
          }
        }
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px"
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "elastic": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }
    }
  },
  plugins: []
};
