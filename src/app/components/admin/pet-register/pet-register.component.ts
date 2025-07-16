import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pet-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-register.component.html',
  styleUrls: ['./pet-register.component.css']
})

export class PetRegisterComponent {
  mascotaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      raza: ['', Validators.required],
      codigoCollar: ['', Validators.required],
      foto: ['']
    });
  }

  onSubmit() {
    if (this.mascotaForm.valid) {
      console.log('Mascota registrada:', this.mascotaForm.value);
      alert('Mascota registrada exitosamente.');
      this.mascotaForm.reset();
    } else {
      this.mascotaForm.markAllAsTouched();
    }
  }
}
