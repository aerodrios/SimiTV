import { Component, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';

import { SimiPrograms } from '../../interfaces/simi-programs';

import { ReplayEpisode } from '../../interfaces/replay-episode';
import { MtxCalendarView, MtxDatetimepickerMode, MtxDatetimepickerType,  } from '@ng-matero/extensions/datetimepicker';
import moment from 'moment';

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
    { id: 1, name: 'SimiActualidad' },
    { id: 2, name: 'ActosdeBondad' },
    { id: 3, name: 'SimiTrabajando' },
    { id: 4, name: 'LaVidaesLucha' },
    { id: 5, name: 'Ayudaresvivir' },
    { id: 6, name: 'SimiPlaneta' },
    { id: 7, name: 'ReencuentroconMéxico' }
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
   
    

    if(data){
      //this.dialogTitle = 'Edit Replay Episode';

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
      });

      console.log(data.dateOri.toString());
      console.log(data.dateReplayEpisode.toString());

   

    }else{
      this.dialogTitle = 'Add Replay Episode';

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
      });
    }
    this.onDateValueChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {

   
    //this.displayDate = moment(this.replayEpisodeForm.get('dateOri')?.value).format('DD-MM-YYYY HH:mm:ss');
    console.log('Saving record with date:', this.replayEpisodeForm.get('dateOri')?.value);

    this.displayDate = moment(this.replayEpisodeForm.get('dateOri')?.value).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    const momentObject = moment(this.replayEpisodeForm.get('dateOri')?.value, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    const momentObject2 = moment(this.displayDate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    
    const dateObject = momentObject.toDate();
    const dateObject2 = momentObject2.toDate();

    console.log('Saving record with date:', dateObject);
    console.log('Saving record with date:', dateObject2);



    this.replayEpisodeForm.get('dateOri')?.setValue( dateObject, { emitEvent: false });


    if (this.replayEpisodeForm.valid) {
      this.dialogRef.close(this.replayEpisodeForm.value);
    }
  }

  parseDateString(dateString: string): Date {
    
    const [day, month, year, hours, minutes, seconds] = dateString.split(/[- :]/).map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }


  onDateValueChanges(): void {
    this.replayEpisodeForm.get('dateOri')?.valueChanges.subscribe(value => {
      if (value) {
       // Display format
       this.displayDate = moment(value).format('DD-MM-YYYY HH:mm:ss');

       // Save format
       const saveFormat = moment(value).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
       
       // Optional: If you want to set the save format back into the form control
       //this.replayEpisodeForm.get('dateOri')?.setValue(saveFormat, { emitEvent: false });
      }
    });

    this.replayEpisodeForm.get('dateReplayEpisode')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedDate = moment(value).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        console.log('Formatted Date:', formattedDate);

        // If you want to update the form control with the formatted date string
        this.replayEpisodeForm.get('dateReplayEpisode')?.setValue(formattedDate, { emitEvent: false });
      }
    });



  }


}