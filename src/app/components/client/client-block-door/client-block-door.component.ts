import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-block-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-block-door.component.html',
  styleUrls: ['./client-block-door.component.css']
})
export class ClientBlockDoorComponent {
  puertaEncendida: boolean = false;

  togglePuerta() {
    this.puertaEncendida = !this.puertaEncendida;
  }
}
