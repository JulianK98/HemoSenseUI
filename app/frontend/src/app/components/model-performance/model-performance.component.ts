import { Component, OnInit } from '@angular/core';
import { Performance } from 'src/app/interfaces/Performance';
import { ActiveLearningService } from 'src/app/services/active-learning.service';

@Component({
  selector: 'app-model-performance',
  templateUrl: './model-performance.component.html',
  styleUrls: ['./model-performance.component.css'],
})
export class ModelPerformanceComponent implements OnInit {
  accuracyPlot: any;
  f1Plot: any;
  numLabelsPlot: any;
  currAccuracy: any;
  currF1: any;
  currNumLabels: any;
  showPlots: boolean = false;

  constructor(private alService: ActiveLearningService) {}

  ngOnInit(): void {
    // Fetch model performance data
    this.alService
      .getPerformanceData()
      .subscribe((payload: Performance) => this.initPlots(payload));
  }

  initPlots(performanceData: Performance): void {
    this.currAccuracy = {
      data: [
        {
          type: 'indicator',
          value:
            performanceData.accuracy[performanceData.accuracy.length - 1] * 100,
          delta: {
            reference:
              performanceData.accuracy[performanceData.accuracy.length - 2] *
              100,
          },
          gauge: { axis: { visible: false, range: [0, 100] } },
        },
      ],
      layout: {
        width: 400,
        height: 267,
        margin: { t: 25, b: 25, l: 25, r: 25 },
        template: {
          data: {
            indicator: [
              {
                title: { text: 'Current Accuracy [%]' },
                mode: 'number+delta+gauge',
                delta: { reference: 90 },
              },
            ],
          },
        },
      },
    };

    this.currF1 = {
      data: [
        {
          type: 'indicator',
          value: performanceData.f1[performanceData.f1.length - 1],
          delta: {
            reference: performanceData.f1[performanceData.f1.length - 2],
          },
          gauge: { axis: { visible: false, range: [0, 1] } },
        },
      ],
      layout: {
        width: 400,
        height: 267,
        margin: { t: 25, b: 25, l: 25, r: 25 },
        template: {
          data: {
            indicator: [
              {
                title: { text: 'Current F1 Score' },
                mode: 'number+delta+gauge',
                delta: { reference: 90 },
              },
            ],
          },
        },
      },
    };

    this.currNumLabels = {
      data: [
        {
          type: 'indicator',
          mode: 'number+delta',
          value:
            performanceData.numLabels[performanceData.numLabels.length - 1],
          delta: {
            reference:
              performanceData.numLabels[performanceData.numLabels.length - 2],
          },
        },
      ],
      layout: {
        width: 400,
        height: 267,
        margin: { t: 25, b: 25, l: 25, r: 25 },
        template: {
          data: {
            indicator: [
              {
                title: { text: 'Current number of labeled Images' },
                mode: 'number+delta+gauge',
                delta: { reference: 90 },
              },
            ],
          },
        },
      },
    };

    this.accuracyPlot = {
      data: [
        {
          x: performanceData.time,
          y: performanceData.accuracy,
          type: 'bar',
          marker: { color: 'orange' },
        },
      ],
      layout: {
        title: 'Accuracy',
        width: 1000,
        height: 267,
        margin: { t: 50, b: 50, l: 50, r: 50 },
        xaxis: { type: 'date' },
      },
    };

    this.f1Plot = {
      data: [
        {
          x: performanceData.time,
          y: performanceData.f1,
          type: 'bar',
          marker: { color: 'green' },
        },
      ],
      layout: {
        title: 'F1 Score',
        width: 1000,
        height: 267,
        margin: { t: 50, b: 50, l: 50, r: 50 },
        xaxis: { type: 'date' },
      },
    };

    this.numLabelsPlot = {
      data: [
        {
          x: performanceData.time,
          y: performanceData.numLabels,
          type: 'bar',
          marker: { color: 'blue' },
        },
      ],
      layout: {
        title: 'Number of labeld images',
        width: 1000,
        height: 267,
        margin: { t: 50, b: 50, l: 50, r: 50 },
      },
    };

    this.showPlots = true;
  }
}
