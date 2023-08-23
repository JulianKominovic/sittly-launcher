export enum SittlyCustomEvents {
  ASYNC_STATUS = "async-status",
}

export type AsyncStatusEvent = {
  title: string;
  description: string;
  status: "IN_PROGRESS" | "SUCCESS" | "ERROR" | "IDLE";
};
