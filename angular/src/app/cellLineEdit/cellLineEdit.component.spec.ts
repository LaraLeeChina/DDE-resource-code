import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellLineEditComponent } from './cellLineEdit.component';

describe('HeaderComponent', () => {
  let component: CellLineEditComponent;
  let fixture: ComponentFixture<CellLineEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellLineEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellLineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
