"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"

import AuthShell from "@/components/auth/AuthShell"
import SignInForm from "@/components/auth/SignInForm"
import { authClient, useSession } from "@/lib/auth/auth-client"
import { signInSchema, type SignInInput } from "@/lib/validations/auth.schema"

const SignInScreen = () => {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending: isSessionPending } = useSession()
  const callbackUrl =
    searchParams.get("callbackUrl") ?? searchParams.get("callbackURL") ?? "/dashboard"

  useEffect(() => {
    if (!isSessionPending && session) {
      router.replace("/dashboard")
    }
  }, [isSessionPending, router, session])

  const handleSubmit = (values: SignInInput) => {
    setErrorMessage(null)

    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: callbackUrl,
      })

      if (error) {
        setErrorMessage(error.message ?? "Unable to sign in right now")
        return
      }

      router.push(callbackUrl)
      router.refresh()
    })
  }

  return (
    <AuthShell
      title="Sign in to continue writing."
      description="Use your email and password to access the protected dashboard and continue building the blog platform."
      alternateHref="/sign-up"
      alternateLabel="Create one"
      alternateText="No account yet?"
    >
      <SignInForm form={form} onSubmit={handleSubmit} isPending={isPending} errorMessage={errorMessage} />
    </AuthShell>
  )
}

export default SignInScreen