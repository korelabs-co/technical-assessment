import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      *ngIf="isOpen"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ title }}
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">{{ message }}</p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              (click)="confirm()"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Confirm
            </button>
            <button
              (click)="cancel()"
              class="px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input() title = "Confirm Action";
  @Input() message = "Are you sure you want to perform this action?";
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }
}
