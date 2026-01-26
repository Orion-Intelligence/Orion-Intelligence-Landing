import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mt-5">
      <h1 class="mb-4">Hello, World from Angular!</h1>
      <button class="btn btn-primary" (click)="toggleMessage()">
        Toggle Message
      </button>

      @if (showMessage()) {
        <div class="alert alert-info mt-4" role="alert">
          <p class="mb-0">This message is shown conditionally using signals and @if!</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  showMessage = signal(false);

  toggleMessage(): void {
    this.showMessage.update(value => !value);
  }
}
