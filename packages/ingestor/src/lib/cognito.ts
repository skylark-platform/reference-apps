import Auth from "@aws-amplify/auth";
import { COGNITO_EMAIL, COGNITO_PASSWORD } from "./constants";

/**
 * signInToCognito - signs into Cognito using the email and password from the environment
 * @returns Promise
 */
export const signInToCognito = () =>
  Auth.signIn(COGNITO_EMAIL, COGNITO_PASSWORD);

/**
 * getToken - returns a Bearer token that is authorized with Skylark
 * @returns Skylark Bearer token
 */
export const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};
