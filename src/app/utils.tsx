import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export const getError = (error: AxiosError<ErrorResponse>): string => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
