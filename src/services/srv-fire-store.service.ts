import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SrvFireStoreService {

  constructor(private db: AngularFirestore) { }


  getAllPrograms() {
    return new Promise<any>((resolve)=> {
      this.db.collection('simiTvPrograms').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
}






}
