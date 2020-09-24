import { toast } from "react-toastify";

export function onError(error) {
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }

  toast.warning(message);
}
