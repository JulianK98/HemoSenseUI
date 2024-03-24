import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ALClassifiy } from 'src/app/interfaces/ALClassify';
import { ALLabels } from 'src/app/interfaces/ALLabels';

@Component({
  selector: 'app-al-classify',
  templateUrl: './al-classify.component.html',
  styleUrls: ['./al-classify.component.css'],
})
export class AlClassifyComponent implements OnInit {
  labelOptions: string[][] = [
    ['', ''],
    ['Red Blood Cell', 'rbc'],
    ['White Blood Cell', 'wbc'],
    ['Platelet', 'plt'],
    ['Aggregate', 'agg'],
    ['Out of Focus', 'oof'],
  ];

  // Index viables
  currImage: number;
  currBCBatch: number;
  bcBatchNum: number;
  bcNumMod: number;

  // Show blood cell images flags
  showImages: boolean[];

  @Input() alClassify: ALClassifiy;
  alLabels: ALLabels = {
    numImages: 0,
    cellNames: [],
    labels: [],
  };
  @Output() onFinishClick: EventEmitter<ALLabels> = new EventEmitter();

  constructor() {
    // Init index variables
    this.currImage = 0;
    this.currBCBatch = 0;
    this.showImages = new Array(6);
    // Init empty alClassify opject
    this.alClassify = {
      numImages: 1,
      cellNames: ['0'],
      images: [''],
      bloodCells: [['', '', '', '', '', '']],
      certainty: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
  }

  ngOnInit(): void {
    // Init batch navigation variables
    this.updateBatchNavVariables();

    // Adapt alLabels object according to alClassify object
    this.alLabels.numImages = this.alClassify.numImages;
    this.alLabels.cellNames = this.alClassify.cellNames;
    this.alLabels.labels = new Array(this.alClassify.numImages);
    for (let i = 0; i < this.alLabels.numImages; i++) {
      this.alLabels.labels[i] = new Array(
        this.alClassify.bloodCells[i].length
      ).fill('');
    }
  }

  updateBatchNavVariables(): void {
    // Update navigation variables
    this.bcBatchNum = Math.ceil(
      this.alClassify.bloodCells[this.currImage].length / 6
    );
    this.bcNumMod = this.alClassify.bloodCells[this.currImage].length % 6;
    if (this.bcNumMod == 0) {
      this.bcNumMod = 6;
    }
    this.updateImageFlags();
  }

  updateImageFlags(): void {
    if (this.currBCBatch == this.bcBatchNum - 1) {
      // Only show bcNumMod images
      for (let i = 0; i < this.bcNumMod; i++) {
        this.showImages[i] = true;
      }
      for (let i = this.bcNumMod; i < 6; i++) {
        this.showImages[i] = false;
      }
    } else {
      // Show all 6 blood cell images
      for (let i = 0; i < 6; i++) {
        this.showImages[i] = true;
      }
    }
  }

  selectLabel(event: any, cellNumber: number) {
    this.alLabels.labels[this.currImage][cellNumber] = event.target.value;
  }

  onFinish(): void {
    this.onFinishClick.emit(this.alLabels);
  }

  onNextImage(): void {
    if (this.currImage < this.alClassify.numImages - 1) {
      this.currImage++;
      // Update blood cell batch information
      this.currBCBatch = 0;
      this.updateBatchNavVariables();
    }
  }

  onPreviousImage(): void {
    if (this.currImage > 0) {
      this.currImage--;
      // Update blood cell batch information
      this.currBCBatch = 0;
      this.updateBatchNavVariables();
    }
  }

  onBack(): void {
    if (this.currBCBatch > 0) {
      this.currBCBatch--;
      this.updateBatchNavVariables();
    }
  }

  onNext(): void {
    if (this.currBCBatch < this.bcBatchNum - 1) {
      this.currBCBatch++;
      this.updateBatchNavVariables();
    }
  }
}
