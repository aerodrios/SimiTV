//inHouse
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, AfterViewInit, inject, } from '@angular/core';
import { Subject } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

// 3rd Party´s
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView,} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
//Configuration
import { environment } from '../environments/environment';
import { SimiPrograms } from './interfaces/simi-programs';
//Services
import { SrvFireStoreService } from '../services/srv-fire-store.service';
import { ReplayEpisode } from './interfaces/replay-episode';
import { MatDialog } from '@angular/material/dialog';
import { ReplayEpisodeDialogComponent } from './components/replay-episode-dialog/replay-episode-dialog.component';

//Prueba DataTable

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

//***********************************************/

//CONSTS
const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

export class DialogContentExample {
  readonly dialog = inject(MatDialog);
}


// const ELEMENT_DATA: ReplayEpisode[] = [
//   {
//     "hourOriginal": "00:00",
//     "dateReplayEpisode": {
//       "seconds": 1722814871,
//       "nanoseconds": 480000000
//     },
//     "nameProgram": "ActosdeBondad",
//     "nameHost": "Fernanda Tapia",
//     "numberReplayEpisode": 2,
//     "comments": "Comentario prueba-2",
//     "id": "MNiq6TtAoaF7hI6dLzhn",
//     "specialGuests": "Fernanda Tapia",
//     "dateOri": {
//       "seconds": 1722814883,
//       "nanoseconds": 109000000
//     },
//     "duration": "2:00"
//   },
//   {
//     "duration": "22:18",
//     "numberReplayEpisode": 1,
//     "nameHost": "Cardona y Aviña",
//     "id": "nY6f63heJmr2tVYxhqvt",
//     "dateOri": {
//       "seconds": 1723142617,
//       "nanoseconds": 853000000
//     },
//     "dateReplayEpisode": {
//       "seconds": 1722969905,
//       "nanoseconds": 259000000
//     },
//     "nameProgram": "SimiActualidad",
//     "hourOriginal": "43:37",
//     "comments": "Comment test",
//     "specialGuests": "Meteorologist"
//   }
// ];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  //Pruebas
  displayedColumns: string[] = ['nameProgram', 'nameHost', 'dateOri', 'specialGuests', 'actions'];

  dataSource: MatTableDataSource<ReplayEpisode>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  //Declarations
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  formattedDateReplayEpisode: string;
  formattedDateOri: string;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors["red"] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors["yellow"] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors["blue"] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors["yellow"] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;


  allSimiTvPrograms: any;

  constructor(private modal: NgbModal, private service: SrvFireStoreService, public dialog: MatDialog, private datePipe: DatePipe) {
    // Logs false for development environment
    console.log(environment); 
    this.getPrograms();

    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
    this.dataSource = new MatTableDataSource(this.allSimiTvPrograms);
    
    
  }




  //Methods
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors["red"],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  //Connect DB FireBase
  getPrograms() {
    this.allSimiTvPrograms =  this.service.getAllPrograms().subscribe((data: ReplayEpisode[]) => {
      this.dataSource.data = data;
      console.log(data);
    });

    console.log(this.allSimiTvPrograms);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  printRow(row: any): void {
    console.log(row);
  }



///////////////////////////////// Modal 

  openDialog() {
    const dialogRef = this.dialog.open(ReplayEpisodeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.addReplayEpisode(result).then(() => {
        this.dataSource.data = [...this.dataSource.data, result];
      });
    }
    });

  }

  openEditDialog(episode: any): void {
    const dialogRef = this.dialog.open(ReplayEpisodeDialogComponent, {
      width: '700px',
      data: { ...episode, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.updateReplayEpisode(episode.id, result).then(() => {
          this.getPrograms(); // Reload data after update
        });
      }
    });
  }

  deleteRecord(id: string): void {
    this.service.deleteReplayEpisode(id).then(() => {
      this.getPrograms(); // Reload data after delete
    }).catch(error => {
      console.error('Error deleting record: ', error);
    });
  }

}

function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}