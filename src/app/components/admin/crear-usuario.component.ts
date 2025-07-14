import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Crear Usuario</h2>
    <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
      <label>
        Nombre:
        <input formControlName="nombre" />
      </label>
      <div *ngIf="usuarioForm.get('nombre')?.touched && usuarioForm.get('nombre')?.invalid" class="error">
        Nombre es requerido.
      </div>

      <label>
        Apellido:
        <input formControlName="apellido" />
      </label>
      <div *ngIf="usuarioForm.get('apellido')?.touched && usuarioForm.get('apellido')?.invalid" class="error">
        Apellido es requerido.
      </div>

      <label>
        Correo:
        <input type="email" formControlName="correo" />
      </label>
      <div *ngIf="usuarioForm.get('correo')?.touched && usuarioForm.get('correo')?.invalid" class="error">
        Correo válido es requerido.
      </div>

      <label>
        Contraseña:
        <input type="password" formControlName="contrasena" />
      </label>
      <div *ngIf="usuarioForm.get('contrasena')?.touched && usuarioForm.get('contrasena')?.invalid" class="error">
        Contraseña de al menos 6 caracteres.
      </div>

      <button type="submit">Crear Usuario</button>
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
export class CrearUsuarioComponent {
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      console.log('Usuario creado:', this.usuarioForm.value);
      alert('Usuario creado exitosamente.');
      this.usuarioForm.reset();
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
}
