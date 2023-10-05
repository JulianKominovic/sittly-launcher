import { ListItem } from "@/devtools/types";
import { TodoistItem } from "@/types/extension";
import React, { useEffect } from "react";
import { BsList } from "react-icons/bs";
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
  setPage,
  setContextMenuOptions,
  addTask,
}: {
  setPage: (page: "CREATION_EDIT" | "LIST") => void;
  setContextMenuOptions: (options: ListItem[]) => void;
  addTask: (task: TodoistItem) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target as any) as any);
        addTask({
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          due_date: Date.now(),
        });
      }}
      className="flex flex-col gap-8 p-4 overflow-auto"
    >
      <Input name="title" required>
        <Fieldset.Label>Title*</Fieldset.Label>
      </Input>
      <Textarea name="description" rows={3}>
        <Fieldset.Label>Description</Fieldset.Label>
      </Textarea>
      <hgroup className="flex">
        <Fieldset.Label>Priority</Fieldset.Label>
        <Select.Root name="priority" defaultValue="MEDIUM">
          <Select.Trigger>
            <Select.Value placeholder="Choose a priority" />
          </Select.Trigger>
          <Select.Content>
            {PRIORITIES.map((status) => (
              <Select.Item value={status}>
                {PRIORITY_VISUAL[status]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </hgroup>

      <hgroup className="flex">
        <Fieldset.Label>Status</Fieldset.Label>
        <Select.Root defaultValue="TODO" name="status">
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
