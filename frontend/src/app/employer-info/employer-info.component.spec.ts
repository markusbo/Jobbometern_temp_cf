import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerInfoComponent } from './employer-info.component';

describe('EmployerInfoComponent', () => {
  let component: EmployerInfoComponent;
  let fixture: ComponentFixture<EmployerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
