import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore
  ) {}


  public createMunicipio(data: {clave: string, municipio: string, significado: string, cabecera: string,
    superficie: string, altitud: string,
    clima: string, latitud: string, longitud: string, zonas: string}) {
    return this.firestore.collection('municipio').add(data);
  }
  // Obtiene un gato
  public getMunicipio(documentId: string) {
    return this.firestore.collection('municipio').doc(documentId).snapshotChanges();
  }

  public getMunicipios() {
    return this.firestore.collection('municipio').snapshotChanges();
  }
  // update user
  public updateMunicipio(municipio, data: any) {
    return this.firestore.collection('municipio').doc(municipio.id).set(data);
  }

  public deleteMunicipio(municipio) {
    return  this.firestore.collection('municipio').doc(municipio.id).delete();
  }
}
