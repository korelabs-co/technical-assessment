import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Task,
  CreateTaskInput,
  TasksService,
} from "../../../../services/task.service";

@Component({
  selector: "app-task-table",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./task-table.component.html",
  styleUrl: "./task-table.component.scss",
})
export class TaskTableComponent {
  @Input() productId: string | null = null;
  @Input() tasks: Task[] = [];
  @Output() tasksChange = new EventEmitter<Task[]>();

  isAddingTask = false;
  editingTask: Task | null = null;
  currentTask: CreateTaskInput = {
    title: "",
    description: "",
    dueAt: "",
  };

  constructor(private tasksService: TasksService) {}

  submitTask() {
    if (!this.productId) return;

    if (this.editingTask) {
      // Handle update
      this.tasksService
        .updateTask(this.editingTask.id, {
          ...this.currentTask,
        })
        .subscribe(() => {
          this.tasksChange.emit(this.tasks);
          this.resetForm();
        });
    } else {
      // Handle create
      this.tasksService
        .createTask({
          ...this.currentTask,
        })
        .subscribe(() => {
          this.tasksChange.emit(this.tasks);
          this.resetForm();
        });
    }
  }

  startEdit(task: Task) {
    this.editingTask = task;
    this.currentTask = {
      title: task.title,
      description: task.description,
      dueAt: task.dueAt,
    };
  }

  deleteTask(taskId: string) {
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasksChange.emit(this.tasks);
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.currentTask = {
      title: "",
      description: "",
      dueAt: "",
    };
    this.isAddingTask = false;
    this.editingTask = null;
  }
}
