import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlClassifyComponent } from './al-classify.component';

describe('AlClassifyComponent', () => {
  let component: AlClassifyComponent;
  let fixture: ComponentFixture<AlClassifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlClassifyComponent]
    });
    fixture = TestBed.createComponent(AlClassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
