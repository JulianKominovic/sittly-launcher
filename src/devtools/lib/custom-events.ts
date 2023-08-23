import { AsyncStatusEvent, SittlyCustomEvents } from "../types/events";

export function dispatchAsyncStatusEvent(asyncStatus: AsyncStatusEvent) {
  const asyncStatusEvent = new CustomEvent<AsyncStatusEvent>(
    SittlyCustomEvents.ASYNC_STATUS,
    {
      detail: asyncStatus,
    }
  );
  window.dispatchEvent(asyncStatusEvent);
}
