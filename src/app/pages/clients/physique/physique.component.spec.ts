import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysiqueComponent } from './physique.component';

describe('AssurancesComponent', () => {
  let component: PhysiqueComponent;
  let fixture: ComponentFixture<PhysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
