import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAutocompleteComponent } from './select-autocomplete.component';

describe('SelectAutocompleteComponent', () => {
  let component: SelectAutocompleteComponent;
  let fixture: ComponentFixture<SelectAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAutocompleteComponent]
    });
    fixture = TestBed.createComponent(SelectAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
