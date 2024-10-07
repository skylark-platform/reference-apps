import useTranslation from "next-translate/useTranslation";
import { GQLError } from "../types";

interface DisplayErrorProps {
  error: GQLError;
  notFoundMessage?: string;
}

export const DisplayError = ({ error, notFoundMessage }: DisplayErrorProps) => {
  const { t } = useTranslation("common");

  const isNotFound = error.response?.errors?.[0].errorType === "NotFound";
  const isNotAuthorized =
    error.response?.errors?.[0].errorType === "UnauthorizedException";

  let header = "error-fetching-page";
  let message: string | GQLError["response"] = error.response;
  let translateMessage = true;

  if (isNotFound) {
    header = "object-not-found";
    message = notFoundMessage || "object-not-found-desc";
    if (notFoundMessage) {
      translateMessage = false;
    }
  }

  if (isNotAuthorized) {
    header = "unauthorized";
    message = "unauthorized-desc";
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center text-white">
      <p className="mb-4 mt-20 text-lg font-medium">{t(`errors.${header}`)}</p>
      {typeof message === "object" ? (
        <pre className="text-sm">{JSON.stringify(message, null, 4)}</pre>
      ) : (
        <p className="max-w-md text-center text-sm">
          {translateMessage ? t(`errors.${message}`) : message}
        </p>
      )}
    </div>
  );
};
