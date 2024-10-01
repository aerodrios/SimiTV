import { NgModule,  } from '@angular/core';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http'
import { Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule} from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MtxCalendarView, MtxDatetimepickerIntl, MtxDatetimepickerMode, MtxDatetimepickerModule, MtxDatetimepickerType, } from '@ng-matero/extensions/datetimepicker';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MtxDateFnsDatetimeModule } from '@ng-matero/extensions-date-fns-adapter';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { LOCALE_ID } from '@angular/core';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';

import { NgxMaskModule } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule} from '@angular/fire/compat'
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';


import { ReplayEpisodeDialogComponent } from './components/replay-episode-dialog/replay-episode-dialog.component';
import { SrvFireStoreService } from '../services/srv-fire-store.service';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from '../services/auth.service';

registerLocaleData(localeEs, 'es-419', localeEsExtra);


@NgModule({
  declarations: [
    AppComponent,
    ReplayEpisodeDialogComponent,
    CalendarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CommonModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    NgbModalModule,
   
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,

    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule, 
    MatTableModule, 
    MatButtonModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatMomentDateModule,

    MtxDatetimepickerModule,
    MtxDateFnsDatetimeModule,

    NgxMaskModule.forRoot(),

  ],
  exports:[
    MtxDatetimepickerModule,
    MtxDateFnsDatetimeModule,       
  ],
  providers: [ SrvFireStoreService, 
    AuthGuard,
    AuthService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-419' }, 
    { provide: LOCALE_ID, useValue: "es-419" }, 
    DatePipe,
    
    provideMomentDatetimeAdapter({
      parse: {
        dateInput: 'DD-MM-YYYY',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'DD-MM-YYYY HH:mm',
      },
      display: {
        dateInput: 'DD-MM-YYYY',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'DD-MM-YYYY HH:mm',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY MMMM ',
        popupHeaderDateLabel: 'DD MMM, ddd',
      },
    }),
      
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    
  ],
  bootstrap: [AppComponent],
 
  
})
export class AppModule { }
