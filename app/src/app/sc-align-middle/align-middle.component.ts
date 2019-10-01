import {Component} from '@angular/core';

@Component({
  selector: 'app-align-middle',
  template: `
    <div class="h-100">
      <div class="container h-100">
        <div class="d-flex align-items-center justify-content-center h-100">
          <div class="d-flex flex-column">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AlignMiddleComponent {
}
