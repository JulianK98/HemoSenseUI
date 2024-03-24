import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectionComponent } from './list-selection.component';

describe('ListSelectionComponent', () => {
  let component: ListSelectionComponent;
  let fixture: ComponentFixture<ListSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSelectionComponent]
    });
    fixture = TestBed.createComponent(ListSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
