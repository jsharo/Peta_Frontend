import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoorService {
  private apiUrl = `${environment.apiUrl}/door/1/control`;

  constructor(private http: HttpClient) {}

  bloquearPuerta(): Observable<any> {
    return this.http.post(this.apiUrl, { lock: true });
  }

  desbloquearPuerta(): Observable<any> {
    return this.http.post(this.apiUrl, { lock: false });
  }

  obtenerEstadoPuerta(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/door/1/status`);
  }
}