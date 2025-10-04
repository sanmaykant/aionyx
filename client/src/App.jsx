//import { useGoogleLogin } from "@react-oauth/google";
//import { authenticateGoogleOAuthUser } from "./utils/api";
//
//export default function App() {
//  const login = useGoogleLogin({
//    onSuccess: async credentialsResponse => {
//        console.log(credentialsResponse)
//      // Extract the ID token (or access token) from the credentialsResponse
//      const idToken = credentialsResponse.credential;
//
//      // Send the token to your backend for verification and further processing
//      await authenticateGoogleOAuthUser(idToken);
//    },
//    onError: () => { console.log("Login failed...") },
//    scope: "https://www.googleapis.com/auth/calendar"
//  });
//
//  return (
//    <button onClick={() => login()}>
//      Sign in with Google
//    </button>
//  );
//}

import { retrieveGoogleAuthUri } from "./utils/api";
import { Button } from "@/components/ui/button";

export default function App() {
    return (
        <Button onClick={async () => {
            const url = await retrieveGoogleAuthUri()
            console.log(url)
            window.location.href = url
        }}>
            Sign in with Google
        </Button>
    );
}
