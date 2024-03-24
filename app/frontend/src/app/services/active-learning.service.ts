import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALDatasets } from '../interfaces/ALDatasets';
import { ALConfiguration } from 'src/app/interfaces/ALConfiguration';
import { ALClassifiy } from 'src/app/interfaces/ALClassify';
import { ALLabels } from 'src/app/interfaces/ALLabels';
import { ALPerformance } from '../interfaces/ALPerformance';
import { SegmentDatasets } from '../interfaces/SegmentDatasets';
import { SegmentConfig } from '../interfaces/SegmentConfig';
import { Performance } from '../interfaces/Performance';

@Injectable({
  providedIn: 'root',
})
export class ActiveLearningService {
  private apiUrl = 'http://' + window.location.hostname + ':5001/';

  private endpoints = {
    alDatasets: 'active-learning/datasets',
    alClassify: 'active-learning/classify',
    alLabels: 'active-learning/labels',
    alPerformance: 'active-learning/performance',
    segmentDatasets: 'segmentation/datasets',
    segmentStart: 'segmentation/start-segmentation',
    performance: 'performance',
  };

  HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  test = 1;
  constructor(private http: HttpClient) {}

  fetchALDatasets(): Observable<ALDatasets> {
    return this.http.get<ALDatasets>(
      `${this.apiUrl}${this.endpoints.alDatasets}`,
      this.HttpOptions
    );
  }

  fetchALClassify(alConfig: ALConfiguration): Observable<ALClassifiy> {
    return this.http.post<ALClassifiy>(
      `${this.apiUrl}${this.endpoints.alClassify}`,
      alConfig,
      this.HttpOptions
    );
  }

  postALLabels(alLabels: ALLabels): Observable<any> {
    return this.http.post<ALLabels>(
      `${this.apiUrl}${this.endpoints.alLabels}`,
      alLabels,
      this.HttpOptions
    );
  }

  getSegmentDatasets(): Observable<SegmentDatasets> {
    return this.http.get<SegmentDatasets>(
      `${this.apiUrl}${this.endpoints.segmentDatasets}`,
      this.HttpOptions
    );
  }

  startBCSegmentation(segmentConfig: SegmentConfig): Observable<any> {
    return this.http.post<SegmentConfig>(
      `${this.apiUrl}${this.endpoints.segmentStart}`,
      segmentConfig,
      this.HttpOptions
    );
  }

  getPerformanceData(): Observable<Performance> {
    return this.http.get<Performance>(
      `${this.apiUrl}${this.endpoints.performance}`,
      this.HttpOptions
    );
  }
}
