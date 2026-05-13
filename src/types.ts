/** Domain types for the tasks-api playground. */

export class TaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskError';
  }
}

export interface Task {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
  readonly createdAt: string;
}
