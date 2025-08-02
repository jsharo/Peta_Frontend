import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Agrega esto
import { environment } from '../../../environments/environment'; // Agrega esto

@Component({
  selector: 'app-pet-view-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Agrega FormsModule aquí
  templateUrl: './pet-view-modal.component.html',
  styleUrls: ['./pet-view-modal.component.css']
})
export class PetViewModalComponent implements OnChanges {
  @Input() mascota: any = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editedMascota: any = {};
  photoPreview: string | null = null;
  selectedPhoto: File | null = null;
  editField: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mascota) {
      this.editedMascota = { ...this.mascota };
      this.photoPreview = this.mascota.foto ? this.getPhotoUrl(this.mascota.foto) : null;
      this.selectedPhoto = null;
      this.editField = null;
    }
  }

  getPhotoUrl(foto: string): string {
    if (!foto) return '';
    return `${environment.apiUrl}/uploads/pets/${foto}`;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  startEdit(field: string): void {
    this.editField = field;
  }

  stopEdit(): void {
    this.editField = null;
  }

  closeModal(): void {
    this.close.emit();
  }

  saveChanges(): void {
    // Emitir todos los campos editados y la nueva foto (si hay)
    this.save.emit({
      ...this.editedMascota,
      nuevaFoto: this.selectedPhoto
    });
  }
}
