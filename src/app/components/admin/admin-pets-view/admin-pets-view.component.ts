import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { PetEditModalComponent } from '../../pet-edit-modal/pet-edit-modal.component'; // Modal comentado

interface Mascota {
  id_pet: number;
  name_pet: string;
  species: string;
  race: string;
  sex: string;
  id_collar: string;
  photo?: string;
  id_user: number;
  is_active?: boolean;
}

@Component({
  selector: 'app-admin-pets-view',
  standalone: true,
  imports: [CommonModule /*, PetEditModalComponent*/], // Modal comentado
  templateUrl: './admin-pets-view.component.html',
  styleUrls: ['./admin-pets-view.component.css']
})
export class AdminPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];
  loading = false;
  userId: string | null = null;
  error: string = '';

  // --- MODAL: propiedades comentadas ---
  // mascotaEdit: Mascota | null = null;
  // modalAbierto = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Obtener el userId de los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || null;
      this.cargarMascotas();
    });
  }

  cargarMascotas(): void {
    this.loading = true;
    this.error = '';
    
    // Obtener token de autenticación
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.error = 'No se encontró token de autenticación';
      this.loading = false;
      return;
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    let endpoint = '';
    
    // Si hay userId, cargar mascotas de ese usuario específico
    if (this.userId) {
      endpoint = `http://localhost:3000/pets/user/${this.userId}`;
    } else {
      // Si no hay userId, cargar mascotas del usuario autenticado
      endpoint = 'http://localhost:3000/pets';
    }
    
    this.http.get<Mascota[]>(endpoint, { headers }).subscribe({
      next: (data) => {
        this.mascotas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
        this.error = 'Error al cargar las mascotas: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }

  irARegistrarMascota(): void {
    if (this.userId) {
      // Si hay un userId, redirigir a registrar mascota para ese usuario
      this.router.navigate(['/admin/pet-register'], {
        queryParams: { clientId: this.userId }
      });
    } else {
      this.router.navigate(['/admin/pet-register']);
    }
  }

  verDetallesMascota(mascota: Mascota): void {
    console.log('Ver detalles de:', mascota);
    // Puedes hacer navegación si tienes vista de detalles
  }

  recargarMascotas(): void {
    this.cargarMascotas();
  }

  obtenerMascotasActivas(): number {
    return this.mascotas.filter(m => m.is_active !== false).length;
  }

  trackByMascota(index: number, mascota: Mascota): number {
    return mascota.id_pet;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  // --- MODAL: métodos comentados ---
  // abrirModalEditar(mascota: Mascota): void {
  //   this.mascotaEdit = { ...mascota };
  //   this.modalAbierto = true;
  // }

  // cerrarModal(): void {
  //   this.modalAbierto = false;
  // }

  // guardarCambiosModal(mascotaActualizada: Mascota): void {
  //   const url = `http://localhost:3000/pets/${mascotaActualizada.id_pet}`;
  //   const body = {
  //     name_pet: mascotaActualizada.name_pet,
  //     age_pet: mascotaActualizada.age_pet,
  //     species: mascotaActualizada.species,
  //     race: mascotaActualizada.race,
  //     sex: mascotaActualizada.sex,
  //     id_collar: mascotaActualizada.id_collar
  //   };

  //   this.http.put(url, body).subscribe({
  //     next: (res) => {
  //       // Actualiza localmente
  //       const index = this.mascotas.findIndex(m => m.id_pet === mascotaActualizada.id_pet);
  //       if (index > -1) {
  //         this.mascotas[index] = { ...mascotaActualizada };
  //       }
  //       this.modalAbierto = false;
  //     },
  //     error: (err) => {
  //       alert('Error al actualizar la mascota');
  //     }
  //   });
  // }
}