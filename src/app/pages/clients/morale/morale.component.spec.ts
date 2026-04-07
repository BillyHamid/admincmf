import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoraleComponent } from './morale.component';

describe('ConsultationsComponent', () => {
  let component: MoraleComponent;
  let fixture: ComponentFixture<MoraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoraleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
