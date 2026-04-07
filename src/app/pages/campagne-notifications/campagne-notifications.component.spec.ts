import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneNotificationsComponent } from './campagne-notifications.component';

describe('FicheMedicalComponent', () => {
  let component: CampagneNotificationsComponent;
  let fixture: ComponentFixture<CampagneNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampagneNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
