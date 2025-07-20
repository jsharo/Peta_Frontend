import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorService } from '../../../services/error.service';

interface Usuario {
  id: number;
  name: string;
  apellido?: string;
  email: string;
  role?: string;
  rol?: string;
  is_active?: boolean; // <-- agrega esta línea
  fechaCreacion?: string;
}

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosClientes: Usuario[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  trackByUsuario(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    // Verificar si hay token
    const token = localStorage.getItem('auth_token');
    console.log('Token encontrado:', token ? 'Sí' : 'No');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    console.log('Haciendo petición a:', 'http://localhost:3000/users');
    console.log('Headers:', headers);

    this.http.get<Usuario[]>('http://localhost:3000/users', { headers }).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos del backend:', data);
        this.usuarios = data;
        
        // Filtrar solo usuarios con rol "CLIENTE"
        const clientes = data.filter(u => {
          const rol = (u.role ?? u.rol ?? '').toString().toLowerCase();
          return rol === 'client' || rol === 'cliente';
        });
        this.usuariosClientes = clientes;
        
        this.loading = false;
        console.log('✅ Usuarios clientes cargados:', this.usuariosClientes);
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        // ✅ REEMPLAZAR todo el manejo manual por ErrorService
        this.error = this.errorService.handleHttpError(err);
        this.loading = false;
          
        // ✅ Manejar casos específicos DESPUÉS del ErrorService
      if (err.status === 401) {
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
      }
    });
  }

  // Método adicional para cargar sin autenticación (para debugging)
  cargarUsuariosSinAuth(): void {
  this.loading = true;
  this.error = '';

  console.log('🔍 Probando sin autenticación...');

  this.http.get<Usuario[]>('http://localhost:3000/users').subscribe({
    next: (data) => {
      console.log('✅ Datos sin auth:', data);
      this.usuarios = data;
      this.usuariosClientes = data.filter(usuario => {
        const rol = (usuario.role ?? usuario.rol ?? '').toString().toLowerCase();
        return rol === 'client' || rol === 'cliente';
      });
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error sin auth:', err);
      this.error = this.errorService.handleHttpError(err);
      this.loading = false;
    }
  });
}

  irAlPanelAdmin() {
    this.router.navigate(['/admin/admin-panel']);
  }

  irARegistrarUsuario() {
    this.router.navigate(['admin/client-register']);
  }

  recargarUsuarios() {
    this.cargarUsuarios();
  }

  // Método para debugging - eliminar después
  probarSinAuth() {
    this.cargarUsuariosSinAuth();
  }

  verUsuario(usuario: any) {
    const userId = usuario.id_user ?? usuario.id;
    if (!userId) {
      console.error('El usuario no tiene id_user ni id:', usuario);
      return;
    }
    this.router.navigate(['/admin/client-detail', userId]);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}