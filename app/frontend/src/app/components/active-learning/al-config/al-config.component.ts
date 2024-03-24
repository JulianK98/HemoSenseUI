import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ALConfiguration } from 'src/app/interfaces/ALConfiguration';

@Component({
  selector: 'app-al-config',
  templateUrl: './al-config.component.html',
  styleUrls: ['./al-config.component.css'],
})
export class AlConfigComponent {
  activateSubmit: boolean = false;
  @Input() datasets: string[];
  alConfig: ALConfiguration = { dataset: '', numImages: 1 };

  @Output() onNextClick: EventEmitter<ALConfiguration> = new EventEmitter();

  onNext(): void {
    this.onNextClick.emit(this.alConfig);
  }

  onDatasetSelect(): void {
    this.activateSubmit = true;
  }
}
