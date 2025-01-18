import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Task,
  TaskInput,
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
  newTask: TaskInput = {
    title: "",
    description: "",
    dueAt: "",
  };

  constructor(private tasksService: TasksService) {}

  submitTask() {
    if (!this.productId) return;

    const taskToCreate = {
      ...this.newTask,
      productId: this.productId,
    };

    this.tasksService.createTask(taskToCreate).subscribe((createdTask) => {
      this.tasksChange.emit(this.tasks);
      this.resetForm();
    });
  }

  deleteTask(index: number) {
    this.tasksService.deleteTask(this.tasks[index].id).subscribe(() => {
      this.tasksChange.emit(this.tasks);
    });
  }

  cancelAdd() {
    this.resetForm();
  }

  private resetForm() {
    this.newTask = {
      title: "",
      description: "",
      dueAt: "",
    };
    this.isAddingTask = false;
  }
}
