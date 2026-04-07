import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierClientsComponent } from './dossier-clients.component';

describe('BoardsComponent', () => {
  let component: DossierClientsComponent;
  let fixture: ComponentFixture<DossierClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
