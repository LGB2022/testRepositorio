import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HomeService } from '../home/home.service';

interface Ciudad {
  id:string;
  nombre_ciudad:string;
  pais:string;
  valoracion?:number //? campo opcional
  ano_registro:number;
  atraccion_principal:string;
}

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})

export class DetailPage implements OnInit {
  id!: string;
  city!: Ciudad;
  nombre_ciudad!: string;
  isNewCity:boolean = false;
  newCity: Ciudad = {
      id: '',
      nombre_ciudad: '',
      pais: '',
      ano_registro: 0,
      atraccion_principal: ''
    }; //obj para almacenar lod datos de la nueva ciudad
  cityList: any[] = [];
  alertCtrl: any;
  //Modo edición desconectado por defecto
  editMode = false;
  
constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private homeService:HomeService
    ) {}

  ngOnInit() {

    const state = this.router.getCurrentNavigation()?.extras.state;
    if(state && state['id'] && state['mode']){
      if(state['mode']==='view'){
        this.editMode = false;
        console.log('Id de la ciudad: ', this.id);
      } else if (state['mode']==='edit'){
        this.activarEditMode();
        console.log('Estado de edición: ', state['mode']);
        //this.loadCityDetails(this.id);
     }
      this.id = state['id'];
      this.loadCityDetails(this.id);
      console.log('segundo loadCityDetails');
    } else {
      console.error('No se encontró el Id de la ciudad o el modo en el estado de navegación.');
    } 

    // Verificar si estamos en modo de creación
      const creacion = this.router.getCurrentNavigation();
      if (creacion && creacion.extras.state && creacion.extras.state['isNewCity']) {
        // Estamos en modo de creación
        this.isNewCity = true;
      } else {
        // No estamos en modo de creación
        this.isNewCity = false;
      }
 }

  loadCityDetails(id: string) {
    // Realizar la consulta a Firebase utilizando el ID de la ciudad
    this.firestore
      .doc(`ciudades/${id}`)
      .valueChanges()
      .subscribe({
        next:(city: any) => {
          // Asignar los detalles de la ciudad a una variable local
          this.city = city;
          console.log('14 Detalles ciudad: ', id)
        }, 
        error: (error:any) => {
          console.error('15 Error al cargar los detalles de la ciudad:', error);
          this.presentAlert('Error', 'Error al cargar los detalles de la ciudad');                                                                                                                     /* ALERT */
        }
      });
  }
 
  crearNuevaCiudad(){
    this.isNewCity = true;
  }

  guardarNuevaCiudad()  {
    console.log('16 Nueva ciudad guardada: ',this.newCity);
   // this.presentAlert('Saved', 'Nueva ciudad guardada');                                                                                                                  /* ALERT */
        
      // verifico si los campos obligatorios están completos
    if (!this.newCity.nombre_ciudad || !this.newCity.pais || !this.newCity.ano_registro || !this.newCity.atraccion_principal) {
      // mensaje de campos obligatorios faltan
      this.presentAlert('Campos obligatorios', 'Los campos nombre de la ciudad, país, año de registro y atracción principal son obligatorios.');
      return;
    }
      // guardo los detalles en la base de datos (Firebase) de la nueva ciudad
    const detallesCiudad = {
      id:'',
      nombre_ciudad: this.newCity.nombre_ciudad,
      pais: this.newCity.pais,
      ano_registro: this.newCity.ano_registro,
      atraccion_principal: this.newCity.atraccion_principal
    };

      // guardo los detalles en la colección 'ciudades'
    this.firestore.collection('ciudades').add(detallesCiudad)
      .then((docRef) => {
        /* quiero obtener el id del ide generado automáticmaentoe por firebase */
        const newCityId = docRef.id;
        console.log('17 Detalles de la ciudad guardados correctamente en Firebase con id: ', newCityId);
        this.presentAlert('Saved', 'Detalles de la ciudad guardados correctamente');
              
        // Actualizar el ID en la propiedad id del obj newCity
        detallesCiudad.id =newCityId;
      
        const newCityWithId = {
          id: newCityId,
          nombre_ciudad: this.newCity.nombre_ciudad,
          pais: this.newCity.pais,
          ano_registro: this.newCity.ano_registro,
          atraccion_principal: this.newCity.atraccion_principal 
        };

        //asignar el id de firebase a la ciudad en firebase 
        this.firestore.collection('ciudades').doc(newCityWithId.id).set(newCityWithId)
        .then(() => {
            console.log('18 Ciudad actualizada correctamente en Firebase');
            
        })
        .catch(error => {
            console.error('19 Error al actualizar la ciudad en Firebase:', error);
        });
      
        // Redirige al usuario a la página de inicio (home)
        this.navCtrl.navigateBack('/home');
      })
      .catch(error => {
        console.error('20 Error al guardar los detalles de la ciudad en Firebase:', error);
      });
  }

  cancelar(){
    // Redirige al usuario a la página de inicio (home)
    this.navCtrl.navigateBack('/home');
    this.editMode = false;
  }

  //Método activar modo edición
  activarEditMode(){
    this.editMode = true;
  }

  updateCityDetails(){
       // Actualizar los detalles de la ciudad en Firebase
    this.firestore
      .doc(`ciudades/${this.id}`)
      .update(this.city)
      .then(() => {
        console.log('21 Detalles de la ciudad actualizados correctamente en Firebase');
        this.presentAlert('Saved', 'Detalles de la ciudad actualizados correctamente');                                                                                                                     /* ALERT */
        // Redirige al usuario a la página de inicio (home)
        this.navCtrl.navigateBack('/home');
      })
      .catch(error => {
        console.error('22 Error al actualizar los detalles de la ciudad en Firebase:', error);
      });
      // Desactivar el modo de edición después de guardar
    this.editMode = false; 
    // Redirige al usuario a la página de inicio (home)
    this.navCtrl.navigateBack('/home');
  }
 
 deleteCity() {
              // Eliminar la ciudad de la base de datos
    this.firestore
      .doc(`ciudades/${this.id}`)
      .delete()
      .then(() => {
           console.log('23 Ciudad eliminada con éxito');
                  // Redirigir al usuario de vuelta a la página principal
           this.router.navigate(['/home']);
        })
      .catch((error) => {
        console.error('24 Error al eliminar la ciudad:', error);
        });
      this.presentAlert('zzzzDeleted', 'Ciudad eliminada con éxito');   
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
function doc(firestore: AngularFirestore, arg1: string) {
  throw new Error('Function not implemented.');
}

function docData(itemDocRef: void, arg1: { idField: string; }): Observable<any> {
  throw new Error('Function not implemented.');
}

function docSnapshots(document: void) {
  throw new Error('Function not implemented.');
}

