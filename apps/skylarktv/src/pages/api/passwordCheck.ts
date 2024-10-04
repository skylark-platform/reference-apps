import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler(process.env.SITE_PASSWORD || "skylarktv", {
  cookieName: "skylarktv-password",
});
