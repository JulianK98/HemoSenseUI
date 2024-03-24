import { Component, OnInit } from '@angular/core';
import { ClassificationService } from 'src/app/services/classification.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
})
export class ImageViewerComponent {
  images: any[] = [];
  subImages: { description: string; b64: string }[][] = [];
  currentImageIndex: number = 0;
  currentSubImageIndex: number = 0;
  totalSubImageIndex: number = 0;

  constructor(private serviceC: ClassificationService) {}

  displayImages(data: any) {
    this.images = data.images;
    this.subImages = data.bloodCells;
  }
  getCurrentImageUrl(): string {
    if (!this.images || this.images.length === 0) return '';
    return 'data:image/jpeg;base64,' + this.images[this.currentImageIndex];
  }

  getCurrentImageName(): string {
    return `Image ${this.currentImageIndex + 1}`;
  }

  getCurrentSubImageUrls(): string[] {
    if (!this.subImages || this.subImages.length === 0) return [];
    let subImages = this.subImages[this.currentImageIndex].slice(
      this.currentSubImageIndex,
      this.currentSubImageIndex + 4
    );
    return subImages.map(
      (subImage: { description: string; b64: string }) =>
        'data:image/jpeg;base64,' + subImage.b64
    );
  }

  getSubImageName(
    index: number
  ): { index: number; description: string } | null {
    const actualIndex = this.currentSubImageIndex + index;
    if (
      this.subImages &&
      this.subImages[this.currentImageIndex] &&
      this.subImages[this.currentImageIndex][actualIndex]
    ) {
      return {
        index: actualIndex + 1,
        description:
          this.subImages[this.currentImageIndex][actualIndex].description,
      };
    }
    return null;
  }

  nextImage(): void {
    if (!this.images || this.images.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.currentSubImageIndex = 0;
  }

  previousImage(): void {
    if (!this.images || this.images.length === 0) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.currentSubImageIndex = 0;
  }

  nextSubImage(): void {
    if (!this.subImages || this.subImages.length === 0) return;
    if (
      this.subImages[this.currentImageIndex] &&
      this.currentSubImageIndex + 4 <
        this.subImages[this.currentImageIndex].length
    ) {
      this.currentSubImageIndex += 4;
    }
  }

  previousSubImage(): void {
    if (!this.subImages || this.subImages.length === 0) return;
    if (
      this.subImages[this.currentImageIndex] &&
      this.currentSubImageIndex - 4 >= 0
    ) {
      this.currentSubImageIndex -= 4;
    }
  }
}
