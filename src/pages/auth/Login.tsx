import { useState } from "react"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <Card className="w-full max-w-[480px] overflow-hidden shadow-xl">
        {/* Decoración superior */}
        <div className="h-32 bg-primary/5 flex items-center justify-center relative">
          <Shield className="text-primary opacity-20" size={64} />
        </div>

        <CardHeader className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground">
            Access your pension consulting dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="e.g. name@company.com"
              className="h-14"
            />
          </div>

          {/* Password */}
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

          {/* Remember me */}
          <div className="flex items-center gap-3">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Botón */}
          <Button className="w-full h-14 text-lg font-bold bg-principal hover:bg-principal-dark">
            Sign In to Dashboard
          </Button>

          {/* Divider */}
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
        </CardContent>
      </Card>
    </div>
  )
}
