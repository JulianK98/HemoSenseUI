import {
  Component,
  OnChanges,
  OnInit,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ALLabels } from 'src/app/interfaces/ALLabels';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
})
export class SubmitComponent implements OnInit {
  labelsPlot: any;
  showPlot = false;
  alLabels: ALLabels;
  @Input() initAlLabbels: ALLabels;
  @Input() alLabelsEmitter: EventEmitter<ALLabels> = new EventEmitter();
  @Output() onSubmitEvent: EventEmitter<any> = new EventEmitter();

  bcCount: number;
  bcClassifiedCount: number;
  rbcCount: number;
  wbcCount: number;
  pltCount: number;
  aggCount: number;
  oofCount: number;

  constructor() {
    this.bcCount = 0;
    this.bcClassifiedCount = 0;
    this.rbcCount = 0;
    this.wbcCount = 0;
    this.pltCount = 0;
    this.aggCount = 0;
    this.oofCount = 0;
  }

  ngOnInit(): void {
    console.log('OnInit started');
    this.alLabels = this.initAlLabbels;
    this.updateLabelStats();
    this.alLabelsEmitter.subscribe(
      (data: ALLabels) => ((this.alLabels = data), this.updateLabelStats())
    );
  }

  updateLabelStats(): void {
    console.log('Update Stats');

    this.bcCount = 0;
    this.bcClassifiedCount = 0;
    this.rbcCount = 0;
    this.wbcCount = 0;
    this.pltCount = 0;
    this.aggCount = 0;
    this.oofCount = 0;
    // Calculate label stats
    for (let i = 0; i < this.alLabels.labels.length; i++) {
      let labelList = this.alLabels.labels[i];
      this.bcCount += labelList.length;
      this.rbcCount += labelList.filter(label => label == 'rbc').length;
      this.wbcCount += labelList.filter(label => label == 'wbc').length;
      this.pltCount += labelList.filter(label => label == 'plt').length;
      this.aggCount += labelList.filter(label => label == 'agg').length;
      this.oofCount += labelList.filter(label => label == 'oof').length;
    }
    this.bcClassifiedCount =
      this.rbcCount +
      this.wbcCount +
      this.pltCount +
      this.aggCount +
      this.oofCount;
    this.updatePlot();
  }

  updatePlot(): void {
    this.labelsPlot = {
      data: [
        {
          values: [
            this.rbcCount,
            this.wbcCount,
            this.pltCount,
            this.aggCount,
            this.oofCount,
            this.bcCount - this.bcClassifiedCount,
          ],
          labels: [
            'Red Blood Cells',
            'White Blood Cells',
            'Thrombocytes',
            'Aggregate',
            'Out of focus',
            'Not labeled',
          ],
          domain: { column: 0 },
          name: 'Labels',
          hoverinfo: 'label+percent+name',
          hole: 0.4,
          type: 'pie',
        },
      ],
      layout: {
        margin: { t: 25, b: 25, l: 25, r: 25 },
        annotations: [
          {
            font: {
              size: 20,
            },
            showarrow: false,
            text: '',
            x: 0.17,
            y: 0.5,
          },
        ],
        height: 350,
        width: 350,
        showlegend: false,
      },
    };

    this.showPlot = true;
  }

  onSubmit(): void {
    this.onSubmitEvent.emit();
  }
}
