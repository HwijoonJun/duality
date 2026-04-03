import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";

type LoginValues = {
  username: string;
  password: string;
};

const initialValues: LoginValues = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("This field is required!"),
  password: Yup.string().required("This field is required!"),
});

export default function LoginPage3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  const currentUser = AuthService.getCurrentUser() as
    | { accessToken?: string; access?: string }
    | null;

  function handleLogin(formValue: LoginValues) {
    const { username, password } = formValue;

    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      (responseData: Record<string, unknown>) => {
        const access =
          (responseData.access as string | undefined) ||
          (responseData.accessToken as string | undefined);
        const refresh =
          (responseData.refresh as string | undefined) ||
          (responseData.refreshToken as string | undefined);

        const user = responseData.user as
          | { id?: number; username?: string; email?: string }
          | undefined;

        if (
          access &&
          refresh &&
          typeof user?.id === "number" &&
          typeof user.username === "string" &&
          typeof user.email === "string"
        ) {
          setAuth({
            access,
            refresh,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });

          setRedirect("/dashboard");
          return;
        }

        setRedirect("/profile");
      },
      (error: unknown) => {
        const typedError = error as {
          response?: { data?: { message?: string } };
          message?: string;
          toString: () => string;
        };

        const resMessage =
          (typedError.response &&
            typedError.response.data &&
            typedError.response.data.message) ||
          typedError.message ||
          typedError.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  }

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  if (accessToken || refreshToken) {
    return <Navigate to="/account" replace />;
  }

  if (currentUser?.accessToken || currentUser?.access) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-[#e5e5e5] bg-white">
        <a href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[25px]">Duality</span>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#666]">Don't have an account?</span>
          <button
            className="px-4 py-2 text-[13px] rounded-lg border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h1 className="text-[32px] leading-tight mb-2">Welcome back</h1>
            <p className="text-[14px] text-[#666]">Sign in to your account to continue</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form className="space-y-4">
              {/* Email Field */}
              <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
                <label htmlFor="username" className="block text-[13px] text-[#666] mb-2">
                  Email
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  placeholder="your@email.com"
                  className="w-full text-[14px] text-black placeholder:text-[#999] focus:outline-none"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="mt-2 text-[12px] text-red-600"
                />
              </div>

              {/* Password Field */}
              <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-[13px] text-[#666]">
                    Password
                  </label>
                  <a href="#" className="text-[12px] text-[#666] hover:text-black transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full text-[14px] text-black placeholder:text-[#999] focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-2 text-[12px] text-red-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl bg-black text-white text-[14px] hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {message}
                </div>
              )}

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e5e5]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#fafafa] px-4 text-[12px] text-[#999]">OR</span>
                </div>
              </div>

              {/* Social Sign In */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full px-6 py-3 rounded-xl border border-[#e5e5e5] bg-white text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="w-full px-6 py-3 rounded-xl border border-[#e5e5e5] bg-white text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
            </Form>
          </Formik>

          {/* Terms */}
          <p className="text-[12px] text-[#999] text-center mt-8">
            By signing in, you agree to our{" "}
            <a href="#" className="text-black hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e5e5e5] bg-white py-6">
        <div className="max-w-4xl mx-auto px-8 flex items-center justify-center gap-6 text-[12px] text-[#666]">
          <a href="#" className="hover:text-black transition-colors">Help</a>
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
          <a href="#" className="hover:text-black transition-colors">Terms</a>
          <span>© 2026 Duality</span>
        </div>
      </footer>
    </div>
  );
}
