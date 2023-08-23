import { dispatchAsyncStatusEvent } from "../lib/custom-events";
import { AsyncStatusEvent } from "../types/events";

export function notifyAsyncOperationStatus(asyncOpDetails: AsyncStatusEvent) {
  dispatchAsyncStatusEvent(asyncOpDetails);
}
