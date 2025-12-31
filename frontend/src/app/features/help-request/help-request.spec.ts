import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpRequest } from './help-request';

describe('HelpRequest', () => {
  let component: HelpRequest;
  let fixture: ComponentFixture<HelpRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
