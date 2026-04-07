import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFormComponent } from './association-form.component';

describe('AssociationFormComponent', () => {
  let component: AssociationFormComponent;
  let fixture: ComponentFixture<AssociationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
