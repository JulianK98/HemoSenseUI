import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataListDataset } from '../interfaces/DataList';
import { DataListData } from '../interfaces/DataList';
import { SelectedData } from '../interfaces/DataList';
import { ClassifiedReturn } from '../interfaces/ClassifiedReturn';

@Injectable({
  providedIn: 'root',
})
export class ClassificationService {
  private apiUrl = 'http://' + window.location.hostname + ':5001/';
  private endpoints = {
    CDataset: 'classification/datasets',
    CData: 'classification/data',
    CSelected: 'classification/selectedData',
    CImages: 'classification/labeledImages',
  };

  HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  test = 1;
  constructor(private http: HttpClient) { }

  fetchCDatasets(): Observable<DataListDataset> {
    return this.http.get<DataListDataset>(
      `${this.apiUrl}${this.endpoints.CDataset}`,
      this.HttpOptions
    );
  }

  fetchCData(selectedDataset: string): Observable<DataListData> {
    return this.http.post<DataListData>(
      `${this.apiUrl}${this.endpoints.CData}`,
      {
        selectedData: selectedDataset,
      },
      this.HttpOptions
    );
  }
}
