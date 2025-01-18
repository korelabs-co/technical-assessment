import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueAt: string;
};

export type TaskInput = Omit<Task, "id">;

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private _baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private _http: HttpClient) {}

  createTask(task: TaskInput): Observable<Task> {
    return this._http.post<Task>(this._baseUrl, task);
  }

  deleteTask(taskId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${taskId}`);
  }

  updateTask(taskId: string, task: TaskInput): Observable<Task> {
    return this._http.patch<Task>(`${this._baseUrl}/${taskId}`, task);
  }
}
