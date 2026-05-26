import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { login } from "@/services/authService"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login({ email, password })
      navigate("/citas", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-[480px] overflow-hidden shadow-xl">
        <div className="h-32 bg-primary/5 flex items-center justify-center relative">
          <Shield className="text-primary opacity-20" size={64} />
        </div>

        <CardHeader className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Iniciar Sesion
          </h1>
          <p className="text-muted-foreground">
            Access your pension consulting dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Usuario
              </label>
              <Input
                type="text"
                placeholder="Ingresa tu usuario"
                className="h-14"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-principal hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-14 pr-12"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              className="w-full h-14 text-lg font-bold bg-principal hover:bg-principal-dark"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Sign In to Dashboard"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New User?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-principal font-bold hover:underline"
              >
                Contact your administrator
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
