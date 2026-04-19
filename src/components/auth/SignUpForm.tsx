import Link from "next/link"
import type { UseFormReturn } from "react-hook-form"

import type { SignUpInput } from "@/lib/validations/auth.schema"

interface SignUpFormProps {
  form: UseFormReturn<SignUpInput>
  onSubmit: (values: SignUpInput) => void
  isPending: boolean
  errorMessage: string | null
}

const SignUpForm = ({ form, onSubmit, isPending, errorMessage }: SignUpFormProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800 dark:text-stone-100" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-stone-200"
          {...register("name")}
        />
        {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800 dark:text-stone-100" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-stone-200"
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800 dark:text-stone-100" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-stone-200"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-stone-500 dark:text-stone-400">
        Already have an account?{" "}
        <Link className="font-semibold text-stone-900 dark:text-stone-100" href="/sign-in">
          Sign in here.
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm