import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActiveLearningService } from 'src/app/services/active-learning.service';
import { ALConfiguration } from 'src/app/interfaces/ALConfiguration';
import { ALDatasets } from 'src/app/interfaces/ALDatasets';
import { ALClassifiy } from 'src/app/interfaces/ALClassify';
import { ALLabels } from 'src/app/interfaces/ALLabels';
import { ALPerformance } from 'src/app/interfaces/ALPerformance';

import { ALCLASSIFY } from 'src/app/mock-data/mock-alClassify';

@Component({
  selector: 'app-active-learning',
  templateUrl: './active-learning.component.html',
  styleUrls: ['./active-learning.component.css'],
})
export class ActiveLearningComponent implements OnInit {
  datasets: string[];
  alConfig: ALConfiguration;
  alClassify: ALClassifiy;
  alLabels: ALLabels;

  alLabelsEmitter: EventEmitter<ALLabels> = new EventEmitter();
  sendLabelsSuccessMsg = '';

  // Step Flags
  showConfig = false;
  showClassify = false;
  showSubmit = false;
  showPerformance = false;

  constructor(private alService: ActiveLearningService) {}

  ngOnInit(): void {
    // fetch dataset names from backend
    this.alService
      .fetchALDatasets()
      .subscribe((payload: ALDatasets) => (this.datasets = payload.datasets));
    this.showConfig = true;

    console.log(window.location.hostname);
  }

  getUnlabeldImages(event: ALConfiguration): void {
    this.alConfig = event;
    // send active learning config to backend, fetch unlabeld imaged from backend
    this.alService
      .fetchALClassify(this.alConfig)
      .subscribe((payload: ALClassifiy) => {
        (this.alClassify = payload), (this.showClassify = true);
      });
  }

  updateLabels(event: ALLabels): void {
    this.alLabels = event;
    this.showSubmit = true;

    // hand updated alLabels object to submit component
    this.alLabelsEmitter.emit(this.alLabels);
  }

  sendLabels(): void {
    this.showPerformance = true;
    // send alLabels object to backend
    this.alService
      .postALLabels(this.alLabels)
      .subscribe(payload => (this.sendLabelsSuccessMsg = payload.message));
  }
}
