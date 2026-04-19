"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import AuthShell from "@/components/auth/AuthShell"
import SignUpForm from "@/components/auth/SignUpForm"
import { authClient, useSession } from "@/lib/auth/auth-client"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth.schema"

const SignUpScreen = () => {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()

  useEffect(() => {
    if (!isSessionPending && session) {
      router.replace("/dashboard")
    }
  }, [isSessionPending, router, session])

  const handleSubmit = (values: SignUpInput) => {
    setErrorMessage(null)

    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      })

      if (error) {
        setErrorMessage(error.message ?? "Unable to create your account right now")
        return
      }

      router.push("/dashboard")
      router.refresh()
    })
  }

  return (
    <AuthShell
      title="Create your author account."
      description="This setup uses Better Auth with MongoDB so you can immediately extend into role-based blog permissions afterward."
      alternateHref="/sign-in"
      alternateLabel="Sign in"
      alternateText="Already have an account?"
    >
      <SignUpForm form={form} onSubmit={handleSubmit} isPending={isPending} errorMessage={errorMessage} />
    </AuthShell>
  )
}

export default SignUpScreen