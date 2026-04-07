import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleveRequestComponent } from './releve-request.component';

describe('FicheMedicalComponent', () => {
  let component: ReleveRequestComponent;
  let fixture: ComponentFixture<ReleveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleveRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
