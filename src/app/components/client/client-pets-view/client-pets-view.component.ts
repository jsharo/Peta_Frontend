import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { PetTipsComponent } from "../pet-tips/pet-tips.component";

interface Mascota {
  id: number;
  nombre: string;
  edad: number;
  raza: string;
  especie: string;
  foto: string;
  codigo?: string;  // nuevo campo opcional para collar
}

@Component({
  selector: 'app-client-pets-view',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, PetTipsComponent],
  templateUrl: './client-pets-view.component.html',
  styleUrls: ['./client-pets-view.component.css']
})
export class ClientPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];

  modalAbierto = false;
  mascotaEdit: Mascota = {
    id: 0,
    nombre: '',
    edad: 0,
    raza: '',
    especie: '',
    foto: '',
    codigo: ''  // inicializado vacío
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user && user.id_user) {
      this.http.get<any[]>(`http://localhost:3000/pets/user/${user.id_user}`)
        .subscribe({
          next: (data) => {
            this.mascotas = data.map(pet => ({
              id: pet.id,
              nombre: pet.name_pet,
              edad: pet.age_pet ?? 0,
              raza: pet.breed_pet ?? '',
              especie: pet.species_pet ?? '',
              foto: pet.photo ?? '',
              codigo: pet.codigo ?? ''  // si backend no tiene, queda vacío
            }));
          },
          error: (err) => {
            console.error('Error al cargar mascotas:', err);
          }
        });
    }
  }

  trackByMascota(index: number, mascota: Mascota): number {
    return mascota.id;
  }

  abrirModalEditar(mascota: Mascota): void {
    this.mascotaEdit = { ...mascota };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardarCambios(): void {
    const url = `http://localhost:3000/pets/${this.mascotaEdit.id}`;
    const body = {
      name_pet: this.mascotaEdit.nombre,
      age_pet: this.mascotaEdit.edad,
      breed_pet: this.mascotaEdit.raza,
      species_pet: this.mascotaEdit.especie
      // NO enviamos codigo collar al backend
    };

    this.http.put(url, body).subscribe({
      next: (res) => {
        console.log('Mascota actualizada en backend:', res);

        // Actualiza localmente toda la mascota, incluido codigo collar
        const index = this.mascotas.findIndex(m => m.id === this.mascotaEdit.id);
        if (index > -1) {
          this.mascotas[index] = { ...this.mascotaEdit };
        }

        this.modalAbierto = false;
      },
      error: (err) => {
        console.error('Error actualizando mascota', err);
        alert('Error al actualizar la mascota. Inténtalo de nuevo.');
      }
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
