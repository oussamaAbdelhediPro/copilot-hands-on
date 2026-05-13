import { beforeEach, describe, expect, it } from 'vitest';

import { _resetStore, completeTask, createTask, listTasks } from '../src/tasks';
import { TaskError } from '../src/types';

beforeEach(() => {
  _resetStore();
});

describe('tasks domain', () => {
  it('creates a task and trims the title', () => {
    const task = createTask('  buy milk  ');
    expect(task.id).toBe(1);
    expect(task.title).toBe('buy milk');
    expect(task.done).toBe(false);
  });

  it('rejects an empty title', () => {
    expect(() => createTask('   ')).toThrow(TaskError);
  });

  it('marks a task done and filters it out of onlyOpen', () => {
    const task = createTask('ship feature');
    completeTask(task.id);
    expect(listTasks({ onlyOpen: true })).toEqual([]);
  });
});
