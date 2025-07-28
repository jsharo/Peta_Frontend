import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pet-tips',
  standalone: true,
  imports: [],
  templateUrl: './pet-tips.component.html',
  styleUrl: './pet-tips.component.css'
})
export class PetTipsComponent implements OnInit, OnDestroy {
  tips: string[] = [
    'Mantén el agua de tu mascota limpia y fresca.',
    'Haz ejercicio diario con tu mascota. No queremos barriles rodantes, ¿verdad?.',
    '¿Ya revisaste la fecha de la proxima vacunación y desparacitación?',
    'Cepilla el pelaje de tu mascota regularmente. De preferencia no con tu cepillo.',
    'The Cake is a Lie.'
  ];
  currentTip = this.tips[0];
  private tipIndex = 0;
  private intervalId: any;

  constructor() { }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.tipIndex = (this.tipIndex + 1) % this.tips.length;
      this.currentTip = this.tips[this.tipIndex];
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
