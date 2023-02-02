import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler(process.env.SITE_PASSWORD || "streamtv", {
  cookieName: "streamtv-password",
});
