import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStructureComponent } from './export-structure.component';

describe('ExportStructureComponent', () => {
  let component: ExportStructureComponent;
  let fixture: ComponentFixture<ExportStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
