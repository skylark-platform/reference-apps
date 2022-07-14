/**
 * Outputs the Stack name using the process.env.STACK_NAME if given,
 * alternatively generates it from git branch, app from process.env
 */
import { STACK_NAME } from "../lib/vars";

// eslint-disable-next-line no-console
console.log(`::set-output name=stack-name::${STACK_NAME}`);
