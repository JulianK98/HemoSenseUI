import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link-box',
  templateUrl: './link-box.component.html',
  styleUrls: ['./link-box.component.css'],
})
export class LinkBoxComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() link = '';
}
