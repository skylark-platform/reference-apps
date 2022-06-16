import Auth from "@aws-amplify/auth";
import { COGNITO_EMAIL, COGNITO_PASSWORD } from "./constants";

export const signInToCognito = () => Auth.signIn(COGNITO_EMAIL, COGNITO_PASSWORD)

export const getToken = async() => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
}
