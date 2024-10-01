import { Component, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';

import { SimiPrograms } from '../../interfaces/simi-programs';

import { ReplayEpisode } from '../../interfaces/replay-episode';
import { MtxCalendarView, MtxDatetimepickerMode, MtxDatetimepickerType,  } from '@ng-matero/extensions/datetimepicker';
import moment from 'moment';
import { TvPrograms } from '../../interfaces/tv-programs';

@Component({
  selector: 'app-replay-episode-dialog',
  templateUrl: './replay-episode-dialog.component.html',
  styleUrl: './replay-episode-dialog.component.css',
})



export class ReplayEpisodeDialogComponent {

  replayEpisodeForm: FormGroup;
  dialogTitle: string;


  // Programs array
  programs: SimiPrograms[] = [
    { id: 1, name: 'Simi actualidad' },
    { id: 2, name: 'Actos de bondad' },
    { id: 3, name: 'Simi trabajando' },
    { id: 4, name: 'La vida es lucha' },
    { id: 5, name: 'Ayudar es vivir' },
    { id: 6, name: 'Simi planeta' },
    { id: 7, name: 'Reencuentro con México' }
  ];
  
  tvPrograms: TvPrograms[] = [
    { id: 1, name: 'Azteca 1', url: 'azteca1.png' },
    { id: 2, name: 'Azteca 7', url: 'azteca7.png' },
    { id: 3, name: 'Estrellas', url: 'estrellas.png'},
    { id: 4, name: 'ImagenTv', url: 'imagentv.png' },
  ];

  //****************** Datetime Control */
  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twelvehour = false;
  timeInterval = 1;
  timeInput = true;
  customHeader!: any;
  actionButtons = false;

  datetime = '';

  momentDateOri: moment.Moment;
  displayDate: string | null = null;


  constructor(
    public dialogRef: MatDialogRef<ReplayEpisodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReplayEpisode,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private adapter: DateAdapter<any>,
  ){

    this.adapter.setLocale('es-419'); 
    const countEpisodes = this.data ? Object.keys(data).filter(key => key !== 'isEdit').length : 0;

    if(data && countEpisodes == 1){

      this.replayEpisodeForm = this.fb.group({
        nameHost: [data[0].nameHost || '', Validators.required],
        specialGuests: [data[0].specialGuests || '',Validators.required],
        duration: [data[0].duration || '00:00', Validators.required],
        id: [''],
        comments: [data[0].comments || '', Validators.required],
        dateReplayEpisode: [this.parseDateString(data[0].dateReplayEpisode.toString()) || new Date(), Validators.required],
        numberReplayEpisode: [data[0].numberReplayEpisode || 0, Validators.required],
        hourOriginal: [data[0].hourOriginal || '00:00', Validators.required],
        dateOri: [this.parseDateString(data[0].dateOri.toString()) || new Date(), Validators.required],
        nameProgram: [data[0].nameProgram || '', Validators.required],
        tvChannel: [data[0].tvChannel || '', Validators.required]
      });

    }else if(data && countEpisodes > 1 )
    {
      this.dialogTitle = 'Actualizar Episodio';
      this.replayEpisodeForm = this.fb.group({
        nameHost: [data.nameHost || '', Validators.required],
        specialGuests: [data.specialGuests || '',Validators.required],
        duration: [data.duration || '00:00', Validators.required],
        id: [''],
        comments: [data.comments || '', Validators.required],
        dateReplayEpisode: [this.parseDateString(data.dateReplayEpisode.toString()) || new Date(), Validators.required],
        numberReplayEpisode: [data.numberReplayEpisode || 0, Validators.required],
        hourOriginal: [data.hourOriginal || '00:00', Validators.required],
        dateOri: [this.parseDateString(data.dateOri.toString()) || new Date(), Validators.required],
        nameProgram: [data.nameProgram || '', Validators.required],
        tvChannel: [data.tvChannel || '', Validators.required]
      });

    }else{
      this.dialogTitle = 'Nuevo Episodio';
      this.replayEpisodeForm = this.fb.group({
        nameHost: ['', Validators.required],
        specialGuests: [ '',Validators.required],
        duration: ['', Validators.required],
        id: [''],
        comments: ['', Validators.required],
        dateReplayEpisode: [new Date(), Validators.required],
        numberReplayEpisode: [ 0, Validators.required],
        hourOriginal: [ '', Validators.required],
        dateOri: [ new Date(), Validators.required],
        nameProgram: ['', Validators.required],
        tvChannel: ['' , Validators.required]
      });
    }
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    
    const dateFormOri = moment(this.replayEpisodeForm.get('dateOri')?.value, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').toDate();
    this.replayEpisodeForm.get('dateOri')?.setValue( dateFormOri, { emitEvent: false });

    const dateFormReplay = moment(this.replayEpisodeForm.get('dateReplayEpisode')?.value, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').toDate();
    this.replayEpisodeForm.get('dateReplayEpisode')?.setValue( dateFormReplay, { emitEvent: false });

    if (this.replayEpisodeForm.valid) {
      this.dialogRef.close(this.replayEpisodeForm.value);
    }
  }

  parseDateString(dateString: string): Date {
    const [day, month, year, hours, minutes, seconds] = dateString.split(/[- :]/).map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }


}