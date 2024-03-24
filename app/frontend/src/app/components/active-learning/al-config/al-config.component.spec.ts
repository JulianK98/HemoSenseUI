import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlConfigComponent } from './al-config.component';

describe('AlConfigComponent', () => {
  let component: AlConfigComponent;
  let fixture: ComponentFixture<AlConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlConfigComponent]
    });
    fixture = TestBed.createComponent(AlConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
