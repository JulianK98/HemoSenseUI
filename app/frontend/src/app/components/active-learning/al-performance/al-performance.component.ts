import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-al-performance',
  templateUrl: './al-performance.component.html',
  styleUrls: ['./al-performance.component.css'],
})
export class AlPerformanceComponent {
  @Input() message: string = '';
}
