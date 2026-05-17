import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const enabled = html.classList.toggle("dark")

    localStorage.setItem("theme", enabled ? "dark" : "light")
    setIsDark(enabled)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-black hover:text-[color:var(--color-principal)] dark:hover:text-gray-400 dark:text-white transition-colors"
      aria-label="Cambiar tema"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
