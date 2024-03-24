import { Component, OnInit, ViewChild} from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { MatSelectionList } from '@angular/material/list';
import { ClassificationService } from 'src/app/services/classification.service';
import { SelectedData } from 'src/app/interfaces/DataList';

@Component({
  selector: 'app-list-selection',
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.css']
})


export class ListSelectionComponent implements OnInit {
  typesOfShoes: string[] = [];
  dropdownOptions: string[] = [];
  selectedOption: string | null = null;
  rangeList: {start: number, end: number, applied: boolean}[] = [{start: 0, end: 0, applied: false}];
  selectedIndices: number[] = [];

  @ViewChild('shoes') shoes!: MatSelectionList;

  constructor(private serviceC: ClassificationService, private sharedService: SharedService) {}

  ngOnInit() {
    this.serviceC.fetchCDatasets()
      .subscribe(response => {
        console.log(response)
        this.dropdownOptions = response.datasets;
        console.log(response.datasets)
      });
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.fetchData(this.selectedOption);
    this.sharedService.selectedDataset = this.selectedOption;
  }

  fetchData(selectedDataset: string){
    this.serviceC.fetchCData(selectedDataset)
    .subscribe(response => {
      this.typesOfShoes = response.data;
    });
  }

  addRange() {
    if (this.isLastRangeApplied()) {
      const start = this.getMinUnselected();
      this.rangeList.push({start, end: start, applied: false});
    }
  }

  applyRange(range: {start: number, end: number, applied: boolean}) {
    // Adjust the end of the range if it exceeds the total number of items
    if (range.end >= this.typesOfShoes.length) {
      range.end = this.typesOfShoes.length - 1;
    }
  
    if (range.end >= range.start) {
      range.applied = true;
      this.selectRange(range);
    }
  }
  
  removeRange(index: number) {
    if (this.rangeList[index].applied) {
      this.deselectRange(this.rangeList[index]);
      this.rangeList.splice(index, 1);
      if(this.rangeList.length == 0) {
        this.rangeList.push({start: 0, end: 0, applied: false});
      }
    }
  }

  isLastRangeApplied() {
    return this.rangeList[this.rangeList.length - 1].applied;
  }

  isApplied(index: number) {
    return this.rangeList[index].applied;
  }

  getMinStart(index: number) {
    return index === 0 ? 0 : this.rangeList[index - 1].end + 1;
  }

  getMinUnselected() {
    for (let i = 0; i < this.typesOfShoes.length; i++) {
      if (!this.selectedIndices.includes(i)) {
        return i;
      }
    }
    return this.typesOfShoes.length;
  }

  selectRange(range: {start: number, end: number, applied: boolean}) {
    for (let i = range.start; i <= range.end; i++) {
      if (!this.selectedIndices.includes(i)) {
        this.selectedIndices.push(i);
        this.shoes.options.toArray()[i].selected = true;
      }
    }
    // update selectedIndices in SharedService
    this.sharedService.selectedIndices = this.selectedIndices;
  }

  deselectRange(range: {start: number, end: number, applied: boolean}) {
    for (let i = range.start; i <= range.end; i++) {
      const index = this.selectedIndices.indexOf(i);
      if (index > -1) {
        this.selectedIndices.splice(index, 1);
        this.shoes.options.toArray()[i].selected = false;
      }
    }
    // update selectedIndices in SharedService
    this.sharedService.selectedIndices = this.selectedIndices;
  }

  get selectedRanges() {
    return this.rangeList.filter(range => range.applied)
                         .map(range => `${range.start}-${range.end}`)
                         .join(', ');
  }
  
  selectSingle(index: number) {
    if (!this.selectedIndices.includes(index)) {
      this.selectedIndices.push(index);
      this.rangeList.push({start: index, end: index, applied: true});
      this.shoes.options.toArray()[index].selected = true;
    }
    // update selectedIndices in SharedService
    this.sharedService.selectedIndices = this.selectedIndices;
  }

  selectAll() {
    // deselect all ranges and reset selectedIndices
    this.rangeList.forEach(range => {
      if (range.applied) {
        this.deselectRange(range);
      }
    });
    this.rangeList = [{start: 0, end: this.typesOfShoes.length - 1, applied: true}];
    this.selectRange(this.rangeList[0]);
  }

}
