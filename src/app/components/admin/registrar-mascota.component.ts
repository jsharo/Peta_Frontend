import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Registrar Mascota</h2>
    <form [formGroup]="mascotaForm" (ngSubmit)="onSubmit()">
      <label>
        Nombre:
        <input formControlName="nombre" />
      </label>
      <div *ngIf="mascotaForm.get('nombre')?.touched && mascotaForm.get('nombre')?.invalid" class="error">
        Nombre es requerido.
      </div>

      <label>
        Edad:
        <input type="number" formControlName="edad" />
      </label>
      <div *ngIf="mascotaForm.get('edad')?.touched && mascotaForm.get('edad')?.invalid" class="error">
        Edad es requerida y debe ser mayor o igual a 0.
      </div>

      <label>
        Raza:
        <input formControlName="raza" />
      </label>
      <div *ngIf="mascotaForm.get('raza')?.touched && mascotaForm.get('raza')?.invalid" class="error">
        Raza es requerida.
      </div>

      <label>
        Código Collar:
        <input formControlName="codigoCollar" />
      </label>
      <div *ngIf="mascotaForm.get('codigoCollar')?.touched && mascotaForm.get('codigoCollar')?.invalid" class="error">
        Código Collar es requerido.
      </div>

      <label>
        Foto (URL opcional):
        <input formControlName="foto" />
      </label>

      <button type="submit">Registrar Mascota</button>
    </form>
  `,
  styles: [`
    form {
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      font-weight: bold;
      display: flex;
      flex-direction: column;
    }
    input {
      padding: 0.3rem;
      font-size: 1rem;
      margin-top: 0.2rem;
    }
    .error {
      color: red;
      font-size: 0.85rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem;
      font-weight: bold;
      cursor: pointer;
      width: fit-content;
    }
  `]
})
export class RegistrarMascotaComponent {
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
