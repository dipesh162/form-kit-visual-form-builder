/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81"
        },
        ink: { 900:"#0f172a", 700:"#334155", 500:"#64748b", 300:"#cbd5e1" },
        ui: { bg:"#ffffff", card:"#ffffff", border:"#e5e7eb", soft:"#f3f4f6" }
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)"
      },
      borderRadius: { xl:"0.75rem", '2xl':"1rem" }
    }
  },
  darkMode: "class",
  plugins: []
}
