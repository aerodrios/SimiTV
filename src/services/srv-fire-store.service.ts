import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReplayEpisode } from '../app/interfaces/replay-episode';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SrvFireStoreService {

  constructor(private db: AngularFirestore) { }


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
          dateReplayEpisode: (data.dateReplayEpisode as Timestamp).toDate(),
          dateOri: (data.dateOri as Timestamp).toDate(),
        } as ReplayEpisode;
      }))
    );
  }


  addReplayEpisode(replayEpisode: ReplayEpisode) {
    return this.db.collection('simiTvPrograms').add(replayEpisode);
  }


}
