import { Component, OnInit } from '@angular/core';
import { SegmentConfig } from 'src/app/interfaces/SegmentConfig';
import { SegmentDatasets } from 'src/app/interfaces/SegmentDatasets';
import { ActiveLearningService } from 'src/app/services/active-learning.service';

@Component({
  selector: 'app-segmentation',
  templateUrl: './segmentation.component.html',
  styleUrls: ['./segmentation.component.css'],
})
export class SegmentationComponent implements OnInit {
  segmentDatasets: SegmentDatasets = { datasets: [''] };
  segmentConfig: SegmentConfig = { dataset: '' };
  message: string = '';
  activateSubmit: boolean = false;

  constructor(private segmentationService: ActiveLearningService) {
    this.segmentDatasets.datasets = [''];
  }

  ngOnInit(): void {
    // Fetch dataset names from backend
    this.segmentationService
      .getSegmentDatasets()
      .subscribe(
        (payload: SegmentDatasets) => (this.segmentDatasets = payload)
      );
  }

  onStartSegmentation(): void {
    // Trigger image segmentation in the backend
    this.segmentationService
      .startBCSegmentation(this.segmentConfig)
      .subscribe(payload => (this.message = payload.message));
  }

  onDatasetSelect(): void {
    this.activateSubmit = true;
  }
}
