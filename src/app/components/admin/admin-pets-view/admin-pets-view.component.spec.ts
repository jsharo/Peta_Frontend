import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPetsViewComponent } from './admin-pets-view.component';

describe('AdminPetsViewComponent', () => {
  let component: AdminPetsViewComponent;
  let fixture: ComponentFixture<AdminPetsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPetsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
