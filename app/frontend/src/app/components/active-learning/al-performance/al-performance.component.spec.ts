import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlPerformanceComponent } from './al-performance.component';

describe('AlPerformanceComponent', () => {
  let component: AlPerformanceComponent;
  let fixture: ComponentFixture<AlPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlPerformanceComponent]
    });
    fixture = TestBed.createComponent(AlPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
