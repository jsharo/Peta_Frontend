import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-register.component.html',
  styleUrls: ['./pet-register.component.css']
})
export class PetRegisterComponent {
  mascota = {
    nombre: '',
    edad: null as number | null,
    raza: '',
    sexo: '',
    codigoCollar: ''
  };

  foto: File | null = null;
  fotoPreview: string | null = null;
  errorFoto = '';

  constructor(private router: Router) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.foto = file;
      this.errorFoto = '';
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.foto = null;
      this.fotoPreview = null;
      this.errorFoto = 'La foto es obligatoria';
    }
  }

  registrarMascota() {
    if (!this.foto) {
      this.errorFoto = 'Debes seleccionar una foto';
      return;
    }

    if (
      !this.mascota.nombre ||
      this.mascota.edad === null ||
      !this.mascota.raza ||
      !this.mascota.sexo ||
      !this.mascota.codigoCollar
    ) {
      return;
    }

    // Aquí puedes enviar los datos + foto al backend
    console.log('Mascota registrada:', this.mascota, this.foto);

    this.router.navigate(['/admin/mascotas']);
  }
}
