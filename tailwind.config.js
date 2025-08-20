/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        greenMain: "#5CB338",  
        yellowMain: "#ECE852", 
        orangeMain: "#FFC145", 
        redMain: "#FB4141"    
      }
    }
  },
  plugins: []
};
