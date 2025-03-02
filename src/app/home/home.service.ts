import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({  providedIn: 'root'})
export class HomeService {
  firestore: any;
  editMode: boolean = false;
  
 /* vamos  a implantar la funcion en el servicio para poder hacer la importación */
  constructor(public http: HttpClient) { }

  loadData():Observable<any[]> {
    return this.http.get<any[]>('https://my-json-server.typicode.com/LGB2022/ciudades/ciudades');
  }

  getCityDetails(nombre_ciudad: string): Observable<any> {
      return this.firestore.collection('ciudades', (
        ref: { where: (arg0: string, arg1: string, arg2: string) => any; }) => 
          ref.where('nombre_ciudad', '==', nombre_ciudad)).valueChanges();
    }
}

