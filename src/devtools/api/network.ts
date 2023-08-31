import { fetch, FetchOptions, ResponseType } from "@tauri-apps/api/http";
import { notifyAsyncOperationStatus } from "./indicators";
/**
 *Perform an HTTP request using the default client.

@example
 import { fetch } from '@tauri-apps/api/http';
    const response = await fetch('http://localhost:3003/users/2', {
    method: 'GET',
    timeout: 30,
    });
 */
const powerfulFetch = async <T>(url: string, options?: FetchOptions) => {
  notifyAsyncOperationStatus({
    title: "Fetching data",
    description: url,
    status: "IN_PROGRESS",
  });
  const response = await fetch<T>(url, options).catch((error) => {
    notifyAsyncOperationStatus({
      title: "Failed to fetch data",
      description: url,
      status: "ERROR",
    });
    throw error;
  });
  notifyAsyncOperationStatus({
    title: "Successfully fetched data",
    description: url,
    status: "SUCCESS",
  });
  return response;
};
export {
  powerfulFetch,
  /**
   * The type of the response body.
   * Use with `powerfulFetch`
   */
  ResponseType,
};
