import { Suspense } from "react"

import SignInScreen from "@/screens/auth/SignInScreen"

const SignInPage = () => (
	<Suspense fallback={null}>
		<SignInScreen />
	</Suspense>
)

export default SignInPage