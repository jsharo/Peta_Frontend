import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE

export interface MascotaEdit {
  id_pet: number;
  name_pet: string;
  age_pet: number;
  species: string;
  sex: string;
  race: string;
  id_collar: string;
}

@Component({
  selector: 'app-pet-edit-modal',
  standalone: true,
  imports: [FormsModule], // <-- AGREGA ESTO
  templateUrl: './pet-edit-modal.component.html',
  styleUrls: ['./pet-edit-modal.component.css']
})
export class PetEditModalComponent {
  @Input() mascota: MascotaEdit = {
    id_pet: 0,
    name_pet: '',
    age_pet: 0,
    species: '',
    sex: '',
    race: '',
    id_collar: ''
  };
  @Input() visible = false;
  @Input() admin = false;
  @Output() save = new EventEmitter<MascotaEdit>();
  @Output() cancel = new EventEmitter<void>();

  editField = {
    name_pet: false,
    age_pet: false,
    species: false,
    sex: false,
    race: false,
    id_collar: false
  };

  toggleEdit(field: keyof typeof this.editField) {
    this.editField[field] = !this.editField[field];
  }

  onSave() {
    this.save.emit({ ...this.mascota });
  }

  onCancel() {
    this.cancel.emit();
  }
}