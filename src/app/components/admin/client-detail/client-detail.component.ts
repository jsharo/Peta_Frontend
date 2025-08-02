import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  userId: string | null = null;
  usuario: any; // o Usuario
  notificaciones: any[] = [];
  mascotas: any[] = [];
  petRegistered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    
    // Verificar si viene de registro exitoso de mascota
    this.route.queryParams.subscribe(params => {
      this.petRegistered = params['petRegistered'] === 'true';
      if (this.petRegistered) {
        setTimeout(() => this.petRegistered = false, 3000); // Ocultar después de 3 segundos
      }
    });

    if (this.userId) {
      this.cargarUsuario();
      this.cargarNotificaciones();
      this.cargarMascotas();
    }
  }

  cargarUsuario(): void {
    this.http.get(`${environment.apiUrl}/users/${this.userId}`).subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (err) => console.error('Error al cargar usuario:', err)
    });
  }

  cargarNotificaciones(): void {
    this.http.get<any[]>(`${environment.apiUrl}/notifications/user/${this.userId}`).subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error('Error al cargar notificaciones:', err)
    });
  }

  cargarMascotas(): void {
    this.http.get<any[]>(`${environment.apiUrl}/pets/user/${this.userId}`).subscribe({
      next: (data) => this.mascotas = data,
      error: (err) => console.error('Error al cargar mascotas:', err)
    });
  }

  goToMascotas(): void {
    this.router.navigate(['/admin/admin-pets-view'], {
      queryParams: { userId: this.userId }
    });
  }

  goToNotificaciones(): void {
    this.router.navigate(['/admin/notifications'], {
      queryParams: { userId: this.userId }
    });
  }

  goToInfo(): void {
    alert(
      `Nombre: ${this.usuario?.name}\nEmail: ${this.usuario?.email}\nRol: ${this.usuario?.role || this.usuario?.rol}`
    );
  }

  cambiarEstadoUsuario(nuevoEstado: boolean): void {
    if (!this.userId) return;
    this.http.patch(`${environment.apiUrl}/users/${this.userId}/status`, { is_active: nuevoEstado }).subscribe({
      next: (data: any) => {
        this.usuario.is_active = data.is_active;
      },
      error: (err) => {
        console.error('Error al cambiar estado del usuario:', err);
        alert('No se pudo cambiar el estado del usuario');
      }
    });
  }
}
