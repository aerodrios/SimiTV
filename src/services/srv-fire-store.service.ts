import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReplayEpisode } from '../app/interfaces/replay-episode';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class SrvFireStoreService {

  formattedDateReplayEpisode: string;
  formattedDateOri: string;

  constructor(private db: AngularFirestore, private datePipe: DatePipe) { }


  // getAllPrograms() {
  
  //   return new Promise<any>((resolve)=> {
  //     this.db.collection('simiTvPrograms').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
  //   })
  
  // }


  getAllPrograms(): Observable<ReplayEpisode[]> {
    return this.db.collection('simiTvPrograms', ref => ref.orderBy('nameProgram'))
    .valueChanges({ idField: 'id' })
    .pipe(
      map(episodes => episodes.map(episode => {
        const data = episode as any;
        return {
          ...data,
          nameHost: decodeURIComponent(data.nameHost),
          dateOri: this.datePipe.transform((data.dateOri as Timestamp).toDate(), 'dd-MM-yyyy HH:mm:ss'),
          dateReplayEpisode: this.datePipe.transform((data.dateReplayEpisode as Timestamp).toDate(), 'dd-MM-yyyy HH:mm:ss'),
        } as ReplayEpisode;
      }))
    );
  }


  addReplayEpisode(replayEpisode: ReplayEpisode) {
    return this.db.collection('simiTvPrograms').add(replayEpisode);
  }

  updateReplayEpisode(id: string, episode: ReplayEpisode): Promise<void> {
    return this.db.collection('simiTvPrograms').doc(id).update(episode);
  }

  deleteReplayEpisode(id: string): Promise<void> {
    return this.db.collection('simiTvPrograms').doc(id).delete();
  }


}
