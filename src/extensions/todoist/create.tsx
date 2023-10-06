import { TodoistItem } from "@/types/extension";
import React from "react";
import sittlyDevtools from "../../devtools/index";
import {
  PRIORITIES,
  PRIORITY_VISUAL,
  TASK_STATUSES,
  TASK_VISUAL_STATUSES,
} from "./const";

const { components } = sittlyDevtools;
const { Fieldset, Input, Button, Textarea, Select } = components;

export function CreateTask({
  addTask,
  updateTask,
  editingTask,
}: {
  addTask: (task: TodoistItem) => void;
  updateTask: (task: TodoistItem) => void;
  editingTask: TodoistItem | null;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target as any) as any);
        const task: TodoistItem = {
          id: editingTask?.id || crypto.randomUUID(),
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          due_date: Date.now(),
        };
        if (editingTask) updateTask(task);
        else addTask(task);
      }}
      className="flex flex-col gap-8 p-4 overflow-auto"
    >
      <Input name="title" required defaultValue={editingTask?.title}>
        <Fieldset.Label>Title*</Fieldset.Label>
      </Input>
      <Textarea
        name="description"
        rows={3}
        defaultValue={editingTask?.description}
      >
        <Fieldset.Label>Description</Fieldset.Label>
      </Textarea>
      <hgroup className="flex">
        <Fieldset.Label>Priority</Fieldset.Label>
        <Select.Root
          name="priority"
          defaultValue={editingTask?.priority ?? "MEDIUM"}
        >
          <Select.Trigger>
            <Select.Value placeholder="Choose a priority" />
          </Select.Trigger>
          <Select.Content>
            {PRIORITIES.map((status) => (
              <Select.Item value={status} key={status}>
                {PRIORITY_VISUAL[status]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </hgroup>

      <hgroup className="flex">
        <Fieldset.Label>Status</Fieldset.Label>
        <Select.Root defaultValue={editingTask?.status ?? "TODO"} name="status">
          <Select.Trigger>
            <Select.Value placeholder="Choose a status" />
          </Select.Trigger>
          <Select.Content>
            {TASK_STATUSES.map((status) => (
              <Select.Item key={status} value={status}>
                {
                  TASK_VISUAL_STATUSES[
                    status as "TODO" | "IN_PROGRESS" | "DONE"
                  ]
                }
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </hgroup>

      <Button type="submit" variant="default">
        Add task
      </Button>
    </form>
  );
}
