import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaCallbackLogoutComponent } from './okta-callback-logout.component';

describe('OktaCallbackLogoutComponent', () => {
  let component: OktaCallbackLogoutComponent;
  let fixture: ComponentFixture<OktaCallbackLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OktaCallbackLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaCallbackLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
