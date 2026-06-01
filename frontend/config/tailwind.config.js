/** @type {import('tailwindcss').Config} */
export default = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Đảm bảo có dòng này để quét các file JSX
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
