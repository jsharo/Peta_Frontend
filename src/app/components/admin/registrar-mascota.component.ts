import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-mascota.component.html',
  styleUrls: ['./registrar-mascota.component.css']
})
export class RegistrarMascotaComponent {
  mascotaForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      raza: ['', Validators.required],
      codigoCollar: ['', Validators.required],
      foto: [null]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mascotaForm.patchValue({ foto: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.mascotaForm.valid) {
      const mascota = this.mascotaForm.value;
      console.log('Mascota registrada:', mascota);
      alert('Mascota registrada correctamente.');
      this.mascotaForm.reset();
      this.previewUrl = null;
    } else {
      this.mascotaForm.markAllAsTouched();
    }
  }
}
