import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { PetTipsComponent } from "../pet-tips/pet-tips.component";
import { PetViewModalComponent } from '../../pet-view-modal/pet-view-modal.component';// Importa el modal
import { environment } from '../../../../environments/environment';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  codigo: string; // id_collar
  edad: number;
  foto: string;
}

@Component({
  selector: 'app-client-pets-view',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, PetTipsComponent, PetViewModalComponent],
  templateUrl: './client-pets-view.component.html',
  styleUrls: ['./client-pets-view.component.css']
})
export class ClientPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];

  // --- MODAL: propiedades comentadas ---
  modalAbierto = false;
  mascotaSeleccionada: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user && user.id_user) {
      this.http.get<any[]>(`${environment.apiUrl}/pets/user/${user.id_user}`)
        .subscribe({
          next: (data) => {
            this.mascotas = data.map(pet => ({
              id: pet.id_pet,
              nombre: pet.name_pet,
              especie: pet.species ?? '',
              raza: pet.race ?? '',
              sexo: pet.sex ?? '',
              codigo: pet.id_collar ?? '',
              edad: pet.age_pet ?? 0,
              foto: pet.photo ?? ''
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

  abrirModalVer(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.mascotaSeleccionada = null;
  }

  guardarCambiosModal(mascotaActualizada: any): void {
    if (!this.mascotaSeleccionada) return;

    const id = this.mascotaSeleccionada.id;
    const formData = new FormData();

    // Mapea los nombres del frontend a los del backend
    formData.append('name_pet', mascotaActualizada.nombre);
    formData.append('species', mascotaActualizada.especie);
    formData.append('race', mascotaActualizada.raza);
    formData.append('sex', mascotaActualizada.sexo);
    formData.append('id_collar', mascotaActualizada.codigo);
    formData.append('age_pet', String(Number(mascotaActualizada.edad)));

    if (mascotaActualizada.nuevaFoto) {
      formData.append('photo', mascotaActualizada.nuevaFoto);
    }

    this.http.put<any>(`${environment.apiUrl}/pets/${id}`, formData).subscribe({
      next: (data) => {
        // Actualiza la mascota en la lista local
        const idx = this.mascotas.findIndex(m => m.id === id);
        if (idx !== -1) {
          this.mascotas[idx] = {
            ...this.mascotas[idx],
            nombre: data.name_pet,
            especie: data.species,
            raza: data.race,
            sexo: data.sex,
            codigo: data.id_collar,
            edad: data.age_pet,
            foto: data.photo ?? this.mascotas[idx].foto
          };
        }
        this.cerrarModal();
      },
      error: (err) => {
        alert('Error al actualizar la mascota');
        console.error(err);
      }
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getFotoUrl(foto: string): string {
    if (!foto) return '';
    return `${environment.apiUrl}/uploads/pets/${foto}`;
  }
}
