import { GQLError } from "../types";

interface DisplayErrorProps {
  error: GQLError;
  notFoundMessage?: string;
}

export const DisplayError = ({ error, notFoundMessage }: DisplayErrorProps) => {
  const isNotFound = error.response?.errors?.[0].errorType === "NotFound";
  const isNotAuthorized =
    error.response?.errors?.[0].errorType === "UnauthorizedException";

  let header = "Error occured fetching page";
  let message: string | GQLError["response"] = error.response;

  if (isNotFound) {
    header = "Object Not Found";
    message =
      notFoundMessage ||
      "The requested object doesn't exist in Skylark with the given Availability Dimensions";
  }

  if (isNotAuthorized) {
    header = "Invalid Skylark Account API Key";
    message =
      "Open the Skylark Account Connection modal to update your API Key.";
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center text-white">
      <p className="mb-4 mt-20 text-lg font-medium">{header}</p>
      {typeof message === "object" ? (
        <pre className="text-sm">{JSON.stringify(message, null, 4)}</pre>
      ) : (
        <p className="max-w-md text-center text-sm">{message}</p>
      )}
    </div>
  );
};
