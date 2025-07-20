import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pet-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-register.component.html',
  styleUrls: ['./pet-register.component.css']
})
export class PetRegisterComponent implements OnInit {
  // Cambiamos la estructura para que coincida con el backend
  mascota = {
    name_pet: '',
    species: '',
    race: '',
    sex: '',
    id_collar: '',
    edad: null as number | null // Mantenemos edad para la UI aunque no exista en backend
  };

  foto: File | null = null;
  fotoPreview: string | null = null;
  errorFoto = '';

  clientId: string | null = null;
  clientName: string = '';
  isAdminRegistering: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Obtener el query parameter del cliente
    this.route.queryParams.subscribe(params => {
      this.clientId = params['clientId'] || null;
      this.isAdminRegistering = !!this.clientId;
      
      console.log('🔍 Query params recibidos:', params);
      console.log('👤 Client ID:', this.clientId);
      console.log('🔧 Is admin registering:', this.isAdminRegistering);
      
      if (this.clientId) {
        this.loadClientInfo();
      }
    });
  }

  loadClientInfo(): void {
    if (!this.clientId) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.errorFoto = 'Token de autenticación no encontrado';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('📡 Cargando información del cliente:', this.clientId);

    this.http.get(`http://localhost:3000/users/${this.clientId}`, { headers })
      .subscribe({
        next: (client: any) => {
          this.clientName = client.name || 'Cliente sin nombre';
          console.log('✅ Cliente cargado:', client);
        },
        error: (err) => {
          console.error('❌ Error al cargar cliente:', err);
          
          if (err.status === 404) {
            this.errorFoto = 'Cliente no encontrado';
            // Redirigir a la vista de clientes después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/admin/admin-clients-view']);
            }, 2000);
          } else if (err.status === 401) {
            this.errorFoto = 'No autorizado para ver este cliente';
          } else {
            this.errorFoto = 'Error al cargar información del cliente';
          }
        }
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.errorFoto = 'Solo se permiten archivos JPG, PNG o GIF';
        this.foto = null;
        this.fotoPreview = null;
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errorFoto = 'El archivo es demasiado grande. Máximo 5MB';
        this.foto = null;
        this.fotoPreview = null;
        return;
      }

      this.foto = file;
      this.errorFoto = '';
      
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      console.log('📁 Archivo seleccionado:', file.name, 'Tamaño:', file.size);
    } else {
      this.foto = null;
      this.fotoPreview = null;
      this.errorFoto = '';
    }
  }

  registrarMascota() {
    console.log('🚀 Iniciando registro de mascota...');
    
    // Limpiar error anterior
    this.errorFoto = '';

    // Validar campos requeridos con trim
    if (
      !this.mascota.name_pet.trim() ||
      this.mascota.edad === null ||
      this.mascota.edad <= 0 ||
      !this.mascota.race.trim() ||
      !this.mascota.sex.trim() ||
      !this.mascota.id_collar.trim()
    ) {
      this.errorFoto = 'Todos los campos son obligatorios y la edad debe ser mayor a 0';
      return;
    }

    // Validar que hay clientId si es admin registrando
    if (this.isAdminRegistering && !this.clientId) {
      this.errorFoto = 'Error: No se encontró el ID del cliente';
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.errorFoto = 'Error de autenticación. Por favor, inicia sesión nuevamente.';
      return;
    }

    this.isLoading = true;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Crear FormData para enviar archivo y datos
    const formData = new FormData();
    formData.append('name_pet', this.mascota.name_pet.trim());
    formData.append('species', this.mascota.species.trim());
    formData.append('race', this.mascota.race.trim());
    formData.append('sex', this.mascota.sex.trim());
    formData.append('id_collar', this.mascota.id_collar.trim());
    
    // Si es admin registrando para un cliente, incluir el clientId
    if (this.isAdminRegistering && this.clientId) {
      formData.append('clientId', this.clientId);
    }
    
    if (this.foto) {
      formData.append('photo', this.foto);
    }

    // Endpoint específico para admin si está registrando para un cliente
    const endpoint = this.isAdminRegistering 
      ? 'http://localhost:3000/pets/admin-create'
      : 'http://localhost:3000/pets';

    console.log('📤 Enviando a endpoint:', endpoint);
    console.log('📝 Es admin registrando:', this.isAdminRegistering);
    console.log('👤 Client ID:', this.clientId);
    console.log('🐕 Datos de la mascota:', {
      name_pet: this.mascota.name_pet,
      edad: this.mascota.edad,
      species: this.mascota.species,
      race: this.mascota.race,
      sex: this.mascota.sex,
      id_collar: this.mascota.id_collar
    });

    this.http.post(endpoint, formData, { headers }).subscribe({
      next: (response) => {
        console.log('✅ Mascota registrada exitosamente:', response);
        this.isLoading = false;
        
        // Limpiar formulario
        this.limpiarFormulario();
        
        // Navegar de vuelta al detalle del cliente si es admin
        if (this.isAdminRegistering && this.clientId) {
          this.router.navigate(['/admin/client-detail', this.clientId], {
            queryParams: { petRegistered: 'true' }
          });
        } else {
          this.router.navigate(['/admin/admin-pets-view']);
        }
      },
      error: (err) => {
        console.error('❌ Error al registrar mascota:', err);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error details:', err.error);
        
        this.isLoading = false;
        
        // Manejo específico de errores
        if (err.status === 400) {
          this.errorFoto = err.error?.message || 'Datos inválidos. Revisa la información.';
        } else if (err.status === 401) {
          this.errorFoto = 'No autorizado. Por favor, inicia sesión nuevamente.';
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 403) {
          this.errorFoto = 'No tienes permisos para realizar esta acción.';
        } else if (err.status === 404) {
          this.errorFoto = 'Cliente no encontrado.';
        } else if (err.status === 409) {
          this.errorFoto = 'El código del collar ya está en uso. Intenta con otro código.';
        } else if (err.status === 413) {
          this.errorFoto = 'La imagen es demasiado grande.';
        } else if (err.status === 415) {
          this.errorFoto = 'Formato de imagen no válido.';
        } else {
          this.errorFoto = 'Error al registrar la mascota. Intenta nuevamente.';
        }
      }
    });
  }

  limpiarFormulario(): void {
    this.mascota = {
      name_pet: '',
      species: '',
      race: '',
      sex: '',
      id_collar: '',
      edad: null
    };
    this.foto = null;
    this.fotoPreview = null;
    this.errorFoto = '';
    
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    console.log('🧹 Formulario limpiado');
  }

  cancelar(): void {
    console.log('❌ Cancelando registro...');
    
    if (this.isAdminRegistering && this.clientId) {
      this.router.navigate(['/admin/client-detail', this.clientId]);
    } else {
      this.router.navigate(['/admin/admin-pets-view']);
    }
  }

  // Método auxiliar para validar el formulario (opcional, para uso en el template)
  isFormValid(): boolean {
    return !!(
      this.mascota.name_pet.trim() &&
      this.mascota.edad !== null &&
      this.mascota.edad > 0 &&
      this.mascota.race.trim() &&
      this.mascota.sex.trim() &&
      this.mascota.id_collar.trim()
    );
  }
}