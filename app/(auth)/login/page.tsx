import { Metadata } from "next";

import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import GoogleLoginForm from "@/components/google-login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function Login() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (<>
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Sign in to your account
              </h3>
              <div className="w-full">
                <GoogleLoginForm />
              </div>
              <div className="w-full flex justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  By connecting your account, you agree to our
                  <a href="/terms-of-service" className="mb-4 underline inline-block text-base text-body-color duration-300 hover:text-[#4A6CF7] dark:text-body-color-dark dark:hover:text-[#4A6CF7]">Terms of Service</a> &nbsp;and&nbsp;
                  <a href="/privacy-policy" className="mb-4 underline inline-block text-base text-body-color duration-300 hover:text-[#4A6CF7] dark:text-body-color-dark dark:hover:text-[#4A6CF7]">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 z-[-1]">
        <svg
          width="1440"
          height="969"
          viewBox="0 0 1440 969"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_95:1005"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1440"
            height="969"
          >
            <rect width="1440" height="969" fill="#090E34" />
          </mask>
          <g mask="url(#mask0_95:1005)">
            <path
              opacity="0.1"
              d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
              fill="url(#paint0_linear_95:1005)"
            />
            <path
              opacity="0.1"
              d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
              fill="url(#paint1_linear_95:1005)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_95:1005"
              x1="1178.4"
              y1="151.853"
              x2="780.959"
              y2="453.581"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_95:1005"
              x1="160.5"
              y1="220"
              x2="1099.45"
              y2="1192.04"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  </>
  );
}
