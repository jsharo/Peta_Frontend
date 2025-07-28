import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { PetTipsComponent } from "../pet-tips/pet-tips.component";
// import { PetEditModalComponent } from '../../pet-edit-modal/pet-edit-modal.component'; // Modal comentado

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
  imports: [CommonModule, NavbarComponent, FormsModule, PetTipsComponent /*, PetEditModalComponent*/], // Modal comentado
  templateUrl: './client-pets-view.component.html',
  styleUrls: ['./client-pets-view.component.css']
})
export class ClientPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];

  // --- MODAL: propiedades comentadas ---
  // modalAbierto = false;
  // mascotaEdit: any = {
  //   id_pet: 0,
  //   name_pet: '',
  //   age_pet: 0,
  //   species: '',
  //   sex: '',
  //   race: '',
  //   id_collar: '',
  //   photo: ''
  // };

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

  // --- MODAL: métodos comentados ---
  // abrirModalEditar(mascota: Mascota): void {
  //   this.mascotaEdit = {
  //     id_pet: mascota.id,
  //     name_pet: mascota.nombre,
  //     age_pet: mascota.edad,
  //     species: mascota.especie,
  //     sex: '', // Si tienes sexo, ponlo aquí
  //     race: mascota.raza,
  //     id_collar: mascota.codigo ?? '',
  //     photo: mascota.foto ?? ''
  //   };
  //   this.modalAbierto = true;
  // }

  // cerrarModal(): void {
  //   this.modalAbierto = false;
  // }

  // guardarCambios(): void {
  //   const url = `http://localhost:3000/pets/${this.mascotaEdit.id}`;
  //   const body = {
  //     name_pet: this.mascotaEdit.nombre,
  //     age_pet: this.mascotaEdit.edad,
  //     breed_pet: this.mascotaEdit.raza,
  //     species_pet: this.mascotaEdit.especie
  //     // NO enviamos codigo collar al backend
  //   };

  //   this.http.put(url, body).subscribe({
  //     next: (res) => {
  //       console.log('Mascota actualizada en backend:', res);

  //       // Actualiza localmente toda la mascota, incluido codigo collar
  //       const index = this.mascotas.findIndex(m => m.id === this.mascotaEdit.id);
  //       if (index > -1) {
  //         this.mascotas[index] = { ...this.mascotaEdit };
  //       }

  //       this.modalAbierto = false;
  //     },
  //     error: (err) => {
  //       console.error('Error actualizando mascota', err);
  //       alert('Error al actualizar la mascota. Inténtalo de nuevo.');
  //     }
  //   });
  // }

  // guardarCambiosModal(mascotaActualizada: any): void {
  //   // Actualiza la mascota en el backend y localmente
  //   const url = `http://localhost:3000/pets/${mascotaActualizada.id}`;
  //   const body = {
  //     name_pet: mascotaActualizada.name_pet,
  //     age_pet: mascotaActualizada.age_pet,
  //     breed_pet: mascotaActualizada.race,
  //     species_pet: mascotaActualizada.species
  //     // No se envía id_collar desde cliente
  //   };

  //   this.http.put(url, body).subscribe({
  //     next: (res) => {
  //       // Actualiza localmente
  //       const index = this.mascotas.findIndex(m => m.id === mascotaActualizada.id);
  //       if (index > -1) {
  //         this.mascotas[index] = {
  //           ...this.mascotas[index],
  //           nombre: mascotaActualizada.name_pet,
  //           edad: mascotaActualizada.age_pet,
  //           raza: mascotaActualizada.race,
  //           especie: mascotaActualizada.species
  //         };
  //       }
  //       this.modalAbierto = false;
  //     },
  //     error: (err) => {
  //       alert('Error al actualizar la mascota');
  //     }
  //   });
  // }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
