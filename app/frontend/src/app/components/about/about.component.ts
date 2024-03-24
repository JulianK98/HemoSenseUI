import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  expandedBox: string | null = null;

  toggleBox(box: string) {
    this.expandedBox = this.expandedBox === box ? null : box;
  }

  get box1Expanded() {
    return this.expandedBox === 'box1';
  }

  get box2Expanded() {
    return this.expandedBox === 'box2';
  }

  get box3Expanded() {
    return this.expandedBox === 'box3';
  }

  get box4Expanded() {
    return this.expandedBox === 'box4';
  }
}