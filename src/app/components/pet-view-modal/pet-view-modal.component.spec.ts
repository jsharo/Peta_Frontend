import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetViewModalComponent } from './pet-view-modal.component';

describe('PetViewModalComponent', () => {
  let component: PetViewModalComponent;
  let fixture: ComponentFixture<PetViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
