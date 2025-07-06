import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Esto lo hace disponible en toda la aplicación
})
export class ErrorService {
  /**
   * Maneja errores HTTP y devuelve mensajes amigables
   * @param error El error recibido
   * @returns Mensaje de error para mostrar al usuario
   */
  handleHttpError(error: HttpErrorResponse): string {
    console.error('Error ocurrido:', error);

    // Errores de conexión (servidor no disponible)
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    // Errores de autenticación
    if (error.status === 401) {
      return 'No autorizado: Email o contraseña incorrectos';
    }

    // Errores de validación
    if (error.status === 400) {
      // Si el backend devuelve un mensaje específico
      if (error.error?.message) {
        return error.error.message;
      }
      return 'Datos inválidos enviados al servidor';
    }

    // Errores de servidor
    if (error.status >= 500) {
      return 'Error interno del servidor. Por favor, intenta más tarde.';
    }

    // Errores conocidos con mensajes específicos
    switch (error.error?.error) {
      case 'UserNotFound':
        return 'Usuario no encontrado';
      case 'InvalidPassword':
        return 'Contraseña incorrecta';
      case 'EmailAlreadyExists':
        return 'Este email ya está registrado';
      default:
        return 'Ocurrió un error inesperado';
    }
  }

  /**
   * Maneja errores genéricos (no HTTP)
   * @param error El error recibido
   * @returns Mensaje de error para mostrar al usuario
   */
  handleGenericError(error: any): string {
    console.error('Error genérico:', error);
    
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Ocurrió un error inesperado';
  }
}