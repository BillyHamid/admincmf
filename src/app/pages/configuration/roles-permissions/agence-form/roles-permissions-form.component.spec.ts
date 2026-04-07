import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionsFormComponent } from './roles-permissions-form.component';

describe('UsersComponent', () => {
  let component: RolesPermissionsFormComponent;
  let fixture: ComponentFixture<RolesPermissionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPermissionsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermissionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
