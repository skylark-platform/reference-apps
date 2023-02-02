import { loginHandler } from "next-password-protect";

export default loginHandler(process.env.SITE_PASSWORD || "streamtv", {
  cookieName: "streamtv-password",
});
