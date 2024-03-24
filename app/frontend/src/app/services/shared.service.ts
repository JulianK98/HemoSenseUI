import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  selectedIndices: number[] = [];
  selectedDataset: string;
}
