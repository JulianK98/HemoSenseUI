import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { AfterViewInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css'],
})
export class ClassificationComponent implements AfterViewInit {
  @ViewChild('viewer') viewer: ImageViewerComponent;
  selectedFiles: File[] = [];
  isLoading: boolean = false;

  private viewerLoaded: Promise<void>;
  private resolveViewerLoaded: () => void;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.viewerLoaded = new Promise<void>(resolve => {
      this.resolveViewerLoaded = resolve;
    });
  }

  ngAfterViewInit() {
    console.log(this.viewer); // should not be undefined
    this.resolveViewerLoaded();
  }

  onFileSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      if (file.name.endsWith('.jpeg')) {
        this.selectedFiles.push(file);
      }
    }
  }

  async startClassification() {
    await this.viewerLoaded;

    if (!this.viewer) {
      console.error('Viewer is not initialized yet');
      return;
    }

    this.isLoading = true;
    this.http
      .post(
        'http://' + window.location.hostname + ':5001/classification/start',
        {
          selectedDataSet: this.sharedService.selectedDataset,
          selectedData: this.sharedService.selectedIndices,
        }
      )
      .subscribe(
        data => {
          this.isLoading = false;
          console.log(this.viewer);
          this.viewer.displayImages(data);
        },
        error => {
          this.isLoading = false;
          console.error('There was an error during the classification', error);
        }
      );
  }
}
