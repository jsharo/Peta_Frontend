import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/users')
      .subscribe(data => {
        this.usuarios = data;
      });
  }

  irAlPanelAdmin() {
    this.router.navigate(['/admin']);
  }
}
