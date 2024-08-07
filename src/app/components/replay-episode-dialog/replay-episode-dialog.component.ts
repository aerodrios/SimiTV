import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplayEpisode } from '../../interfaces/replay-episode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-replay-episode-dialog',
  templateUrl: './replay-episode-dialog.component.html',
  styleUrl: './replay-episode-dialog.component.css',
})



export class ReplayEpisodeDialogComponent {

  replayEpisodeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReplayEpisodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReplayEpisode,
    private fb: FormBuilder
  ){
   
    this.replayEpisodeForm = this.fb.group({
      nameHost: ['', Validators.required],
      specialGuests: [''],
      duration: ['', Validators.required],
      id: [''],
      comments: [''],
      dateReplayEpisode: [new Date(), Validators.required],
      numberReplayEpisode: [0, Validators.required],
      hourOriginal: ['', Validators.required],
      dateOri: [new Date(), Validators.required],
      nameProgram: ['', Validators.required]
    });
  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.replayEpisodeForm.valid) {
      this.dialogRef.close(this.replayEpisodeForm.value);
    }
  }
}