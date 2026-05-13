import { type Task, TaskError } from './types';

const store: Map<number, Task> = new Map();
let nextId = 1;

/** Insert a new task and return it. Throws TaskError on empty title. */
export function createTask(title: string): Task {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new TaskError('title must not be empty');
  }
  const task: Task = {
    id: nextId++,
    title: trimmed,
    done: false,
    createdAt: new Date().toISOString(),
  };
  store.set(task.id, task);
  return task;
}

/** Return all tasks, newest first. Pass onlyOpen to drop completed ones. */
export function listTasks(options: { onlyOpen?: boolean } = {}): Task[] {
  const all = [...store.values()].sort((a, b) => b.id - a.id);
  return options.onlyOpen ? all.filter((t) => !t.done) : all;
}

/** Mark a task done. Throws TaskError if the id is unknown. */
export function completeTask(taskId: number): Task {
  const task = store.get(taskId);
  if (!task) {
    throw new TaskError(`no task with id=${taskId}`);
  }
  const done: Task = { ...task, done: true };
  store.set(taskId, done);
  return done;
}

/** Test-only helper: wipe the in-memory store. */
export function _resetStore(): void {
  store.clear();
  nextId = 1;
}
