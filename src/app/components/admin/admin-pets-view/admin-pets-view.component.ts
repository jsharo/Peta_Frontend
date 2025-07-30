import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PetViewModalComponent } from '../../pet-view-modal/pet-view-modal.component'; // Ajusta la ruta si es necesario

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
  age_pet: number; // <-- Agregado aquí
}

@Component({
  selector: 'app-admin-pets-view',
  standalone: true,
  imports: [CommonModule, FormsModule, PetViewModalComponent], // <-- agrega aquí el modal
  templateUrl: './admin-pets-view.component.html',
  styleUrls: ['./admin-pets-view.component.css']
})
export class AdminPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];
  loading = false;
  userId: string | null = null;
  error: string = '';

  mascotaSeleccionada: Mascota | null = null;
  modalAbierto: boolean = false;

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

  abrirModalVer(mascota: Mascota): void {
    this.mascotaSeleccionada = {
      ...mascota,
      nombre: mascota.name_pet,
      especie: mascota.species,
      raza: mascota.race,
      sexo: mascota.sex,
      codigo: mascota.id_collar,
      edad: mascota.age_pet,
      foto: mascota.photo,
      id_pet: mascota.id_pet // <-- al final, así nunca se sobrescribe
    } as any;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.mascotaSeleccionada = null;
  }

  guardarCambiosModal(mascotaActualizada: any): void {
    if (!this.mascotaSeleccionada) return;

    const id = mascotaActualizada.id_pet ?? this.mascotaSeleccionada.id_pet;
    if (!id) {
      alert('Error: No se encontró el ID de la mascota.');
      return;
    }

    const formData = new FormData();
    formData.append('name_pet', mascotaActualizada.nombre);
    formData.append('species', mascotaActualizada.especie);
    formData.append('race', mascotaActualizada.raza);
    formData.append('sex', mascotaActualizada.sexo);
    formData.append('id_collar', mascotaActualizada.codigo);
    formData.append('age_pet', String(Number(mascotaActualizada.edad)));
    if (mascotaActualizada.nuevaFoto) {
      formData.append('photo', mascotaActualizada.nuevaFoto);
    }

    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role');
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    // LOG para depuración
    console.log('Rol detectado:', userRole);
    console.log('ID mascota:', id);

    // Usa endpoint de admin si el usuario es admin
    const endpoint = userRole === 'ADMIN'
      ? `http://localhost:3000/pets/admin/${id}`
      : `http://localhost:3000/pets/${id}`;

    console.log('Endpoint usado:', endpoint);

    this.http.put<any>(
      endpoint,
      formData,
      { headers }
    ).subscribe({
      next: (data) => {
        // Actualiza la mascota en la lista local
        const idx = this.mascotas.findIndex(m => m.id_pet === id);
        if (idx !== -1) {
          this.mascotas[idx] = {
            ...this.mascotas[idx],
            name_pet: data.name_pet,
            species: data.species,
            race: data.race,
            sex: data.sex,
            id_collar: data.id_collar,
            age_pet: data.age_pet,
            photo: data.photo ?? this.mascotas[idx].photo
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
}