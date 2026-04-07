import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequisComponent } from './document-requis.component';

describe('BasicComponent', () => {
  let component: DocumentRequisComponent;
  let fixture: ComponentFixture<DocumentRequisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
