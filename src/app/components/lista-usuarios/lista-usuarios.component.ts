import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Usuario {
  id: number;
  name: string;        
  apellido?: string;   
  email: string;
  role: string;        
  isActive?: boolean;  
  fechaCreacion?: string;
}

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosClientes: Usuario[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

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
        this.usuariosClientes = data.filter(usuario => 
          usuario.role && usuario.role.toUpperCase() === 'CLIENTE'
        );
        
        this.loading = false;
        console.log('✅ Usuarios clientes cargados:', this.usuariosClientes);
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        console.error('❌ Error body:', err.error);
        
        // Mensaje de error más específico
        if (err.status === 401) {
          this.error = 'No autorizado. Por favor, inicia sesión nuevamente.';
          localStorage.removeItem('auth_token'); // Limpiar token inválido
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 403) {
          this.error = 'No tienes permisos para ver esta información.';
        } else if (err.status === 0) {
          this.error = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
        } else if (err.status === 500) {
          this.error = 'Error interno del servidor. Revisa la consola del backend para más detalles.';
          console.error('❌ Detalles del error 500:', err.error);
        } else {
          this.error = `Error al cargar los usuarios: ${err.status} - ${err.message}`;
        }
        
        this.loading = false;
        
        // Datos de ejemplo para desarrollo (solo cuando hay error)
        console.log('📝 Mostrando datos de ejemplo debido al error');
        this.usuariosClientes = [
          { 
            id: 1, 
            name: 'Juan', 
            email: 'juan@example.com', 
            role: 'CLIENTE',
            isActive: true,
            fechaCreacion: '2024-01-15'
          },
          { 
            id: 2, 
            name: 'María', 
            email: 'maria@example.com', 
            role: 'CLIENTE',
            isActive: true,
            fechaCreacion: '2024-01-20'
          },
          { 
            id: 3, 
            name: 'Carlos', 
            email: 'carlos@example.com', 
            role: 'CLIENTE',
            isActive: false,
            fechaCreacion: '2024-02-01'
          }
        ];
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
        this.usuariosClientes = data.filter(usuario => 
          usuario.role && usuario.role.toUpperCase() === 'CLIENTE'
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error sin auth:', err);
        this.error = `Error sin autenticación: ${err.status} - ${err.message}`;
        this.loading = false;
      }
    });
  }

  irAlPanelAdmin() {
    this.router.navigate(['/admin']);
  }

  irARegistrarUsuario() {
    this.router.navigate(['/register']);
  }

  recargarUsuarios() {
    this.cargarUsuarios();
  }

  // Método para debugging - eliminar después
  probarSinAuth() {
    this.cargarUsuariosSinAuth();
  }
}