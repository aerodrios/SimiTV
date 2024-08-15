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


 

  objCalendarObj : CalendarEvent[];





  activeDayIsOpen: boolean = true;


  allSimiTvPrograms: any;

  constructor(private modal: NgbModal, private service: SrvFireStoreService, public dialog: MatDialog, private datePipe: DatePipe) {
    this.getPrograms();
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

  eventTimesChanged({event, newStart, newEnd,}: CalendarEventTimesChangedEvent): void {
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



  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors["red"],
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  // }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter((event) => event !== eventToDelete);
  // }

  setView(view: CalendarView) {
    this.view = view;
  }



  
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }











  //Connect DB FireBase
  getPrograms() {
    this.allSimiTvPrograms =  this.service.getAllPrograms().subscribe((data: ReplayEpisode[]) => {
      
      data.sort((a, b) => {
        const dateA = this.parseDateString(a.dateOri.toString());
        const dateB = this.parseDateString(b.dateOri.toString());
        return dateB.getTime() - dateA.getTime();
      });

      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;

      this.objCalendarObj = this.convertReplayEpisodesToCalendarEventsV2(data);
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


  // convertReplayEpisodesToCalendarEvents = (replayEpisodes: ReplayEpisode[]): CalendarEvent[] => {
  //   return replayEpisodes.map(episode => {
  //     return {
  //       id: episode.id,
  //       start: episode.dateOri,
  //       end: episode.dateReplayEpisode,
  //       title: episode.nameProgram,
  //       color: { ...colors["red"] },
  //       actions: [
  //         {
  //           label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //           a11yLabel: 'Edit',
  //           onClick: ({ event }: { event: CalendarEvent }): void => {
  //             this.handleEvent('Edited', event);
  //           },
  //         },
  //         {
  //           label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //           a11yLabel: 'Delete',
  //           onClick: ({ event }: { event: CalendarEvent }): void => {
  //             this.events = this.events.filter((iEvent) => iEvent !== event);
  //             this.handleEvent('Deleted', event);
  //           },
  //         },
  //       ],
  //       allDay: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //       draggable: true,
  //       meta: {
  //       //   hostname: episode.nameHost,
  //       //   numberReplayEpisode: episode.numberReplayEpisode,
  //       //   comments: episode.comments,
  //       //   specialGuests: episode.specialGuests,
  //       //   isEdit: episode.isEdit
  //       }
  //     } as CalendarEvent<ReplayEpisode>;
  //   });
  // };

   convertReplayEpisodesToCalendarEventsV2 = (replayEpisodes: ReplayEpisode[]): CalendarEvent<ReplayEpisode>[] => {
    return replayEpisodes.map(episode => {

        return {
        id: episode.id,
        start: this.convertToDate(episode.dateOri.toString()),
        end: this.convertToDate(episode.dateReplayEpisode.toString()),
        title: episode.nameProgram,
        color: { ...colors["red"] },
        actions: [
          {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              //this.handleEvent('Edited', event);
              this.openEditDialogCalendar(event)
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
        ],
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
        meta: {
          nameHost: episode.nameHost,
          numberReplayEpisode: episode.numberReplayEpisode,
          comments: episode.comments,
          specialGuests: episode.specialGuests,
          isEdit: episode.isEdit
        },
        imageUrl: './../../assets/azteca1.png'
      } as CalendarEvent<ReplayEpisode>;
    });
  };
  
  ngAfterViewInit() {
  
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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

  openEditDialogCalendar(episode: any): void {

    let elemetEpisode = this.dataSource.data.find(ep => ep.id === episode.id);

    const dialogRef = this.dialog.open(ReplayEpisodeDialogComponent, {
      width: '700px',
      data: { ...elemetEpisode, isEdit: true }
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

  parseDateString(dateString: string): Date {
    const [day, month, year, hours, minutes, seconds] = dateString.split(/[- :]/).map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

   convertToDate = (dateString: string): Date => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  getDayFromDate(dateString: string): number {
    const date = new Date(dateString);
    return date.getDate(); // Returns the day of the month (1-31)
  }

  
  hasEvents(day: Date): boolean {
    return this.objCalendarObj?.some(event => this.isSameDay(day, event.start));
  }
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  // getEventsForDay(day: Date): CalendarEvent[] {
  //   const events = this.objCalendarObj ?? [];
  //   return events.filter(event => this.isSameDay(event.start, day));
  // }

  getEventsForDay(day: Date): CalendarEvent[] {
    const events = this.objCalendarObj ?? [];
    return (events ?? []).filter(event => this.isSameDay(event.start, day));
  }




}

