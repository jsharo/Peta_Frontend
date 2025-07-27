import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoorService {
  private apiUrl = 'http://localhost:3000/door/1/control';
  private getUrl = 'http://localhost:3000/door/1'; // <-- Nueva URL para obtener el estado

  constructor(private http: HttpClient) {}

  bloquearPuerta(): Observable<any> {
    return this.http.post(this.apiUrl, { lock: true });
  }

  desbloquearPuerta(): Observable<any> {
    return this.http.post(this.apiUrl, { lock: false });
  }

  obtenerEstadoPuerta(): Observable<any> {
    return this.http.get('http://localhost:3000/door/1/status');
  }
}