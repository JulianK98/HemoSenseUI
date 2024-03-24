import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  public routeLinks = [
    { link: '', name: 'Home', icon: 'home' },
    { link: 'classification', name: 'Classification', icon: 'class' },
    { link: 'improve-model', name: 'Improve Model', icon: 'trending_up' },
    { link: 'performance', name: 'Model Performance', icon: 'bar_chart' },
    { link: 'segmentation', name: 'Image Segmentation', icon: 'image' },
    { link: 'about', name: 'About', icon: 'info' },
  ];
}
