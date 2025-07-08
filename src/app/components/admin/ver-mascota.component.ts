import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Mascota {
  nombre: string;
  edad: number;
  raza: string;
  codigoCollar: string;
  foto?: string;
}

@Component({
  selector: 'app-ver-mascotas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Registrar Mascota</h2>
    <form [formGroup]="mascotaForm" (ngSubmit)="agregarMascota()">
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
        Edad es requerida y debe ser positiva.
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
        Foto (URL Opcional):
        <input formControlName="foto" />
      </label>

      <button type="submit">Registrar Mascota</button>
    </form>

    <hr />

    <h2>Mascotas Registradas</h2>
    <div *ngIf="mascotas.length === 0">No hay mascotas registradas.</div>

    <div class="mascota-card" *ngFor="let mascota of mascotas">
      <img *ngIf="mascota.foto" [src]="mascota.foto" [alt]="mascota.nombre" />
      <h3>{{ mascota.nombre }}</h3>
      <p><strong>Edad:</strong> {{ mascota.edad }} años</p>
      <p><strong>Raza:</strong> {{ mascota.raza }}</p>
      <p><strong>Código Collar:</strong> {{ mascota.codigoCollar }}</p>
    </div>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
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
      width: fit-content;
      padding: 0.5rem 1rem;
      font-weight: bold;
      margin-top: 1rem;
    }

    .mascota-card {
      border: 1px solid #ccc;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      max-width: 400px;
    }

    .mascota-card img {
      width: 100%;
      max-width: 150px;
      border-radius: 6px;
      margin-bottom: 1rem;
    }
  `]
})
export class VerMascotasComponent {
  mascotas: Mascota[] = [];

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

  agregarMascota() {
    if (this.mascotaForm.invalid) {
      this.mascotaForm.markAllAsTouched();
      return;
    }

    this.mascotas.push(this.mascotaForm.value);
    this.mascotaForm.reset();
  }
}
