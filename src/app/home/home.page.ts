import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  cityList: any = [];
  newItem = '';
  dataLoaded:boolean = false;
  username: string='';
  lastUpdateTime: Date | null = null;
  router: any;

          /* hacemos uso del router de angular dentro del constructor */
          /* importar el servicio y tratemos los datos que nos devuelve la api para poblar la lista*/
          /*importar el servicio de firebase para poder subir los items que nos llegan dentro de firebase*/
  constructor(
    public route: Router, 
    public homeService:HomeService,
    private alertController: AlertController,
    public firestore: AngularFirestore) {
        this.homeService.loadData()
        .subscribe((response:any) => {
          console.log(response)
          response.forEach((item:any) => {
                /*solo estamos guardando el título: this.cityList.push(item.title)); 
                y tb queremos su id por tanto guardaremos el item entero*/
            this.cityList.push(item);
        
                /*creamos una convención para que nos guarde todos los items del json*/
            let collectionRef = this.firestore.doc('ciudades/' + item.id)
            collectionRef.set({
              id:item.id,
              nombre_ciudad:item.nombre_ciudad,
              pais:item.pais,
              valoracion:item.valoracion,
              ano_registro:item.ano_registro,
              atraccion_principal:item.atraccion_principal
              })
                /* recuperar todos los items que guardamos dentro de firebase  con un get y 
                una función callback donde vendrá el resultado que nos devuelve firebase
                con la función data dentro de result*/
                collectionRef.get().subscribe(result => {
                  console.log('1',result.data())
                });
          });
        });
    };
    

  ngOnInit(): void {
        /* operaciones al inicializar el componente */
/*    this.loadDataIfNeeded();
    /* para recuperar nombre usuario almacenado localmente */
    const storedUsername = localStorage.getItem('username');
    if (storedUsername !== null) {
      this.username = storedUsername;
    } else {
      // valor por defecto nombre usuario "Usuario"
      this.username = 'Usuario'; 
    }
  /* this.cargarDatos();
  */
   this.loadDataIfNeeded();
  }
  
  /* método para eliminar la ciudad cuando clican el botón eliminar */
  onCompleteItem(index:number,id:string){
                /* splice funcion para borrar items dentro de una array */
      this.cityList.splice(index,1)
      console.log('2 Id ciudad onCompleteItem: ', id);
                // Eliminar la ciudad de la base de datos
      this.firestore
      .doc('ciudades/' + id)
      .delete()
      .then(() => {
          console.log('3 Ciudad eliminada correctamente');
              
        })
      .catch((error) => {
        console.error('4 Error al eliminar la ciudad:', error);
      });
  }

  goToDetail(item: any) {
      console.log('8 ID de la ciudad:', item.id);
      console.log('9 goToDetail');
      // Cambiar la siguiente página desde un item
      // this.route.navigate(['/detail/' + item.id], { queryParams: { text: item.nombre_ciudad } });

      // Por la siguiente ruta
      this.route.navigate(['/detail'],{state: {id:item.id, mode:'view'}});
  }

  goToDetailPlus( ) {
      // Cambiar la siguiente línea desde el +
      console.log('10 goToDetailPlus:');
    // Por la siguiente ruta y añadimos el boolean a true para que abra la parte de creación ciudad nueva
    this.route.navigate(['/detail'], {state: {isNewCity: true}});
  }

loadDataIfNeeded() {
  // Verifica si los datos ya están cargados en la variable local
  if (this.dataLoaded) {
    console.log('Los datos ya están cargados.');
    return;
  }
  // Si los datos no están cargados, llamar a la función para cargarlos
  this.cargarDatos();
}
cargarDatos() {
  console.log('10 1/2 cargarDatos');
  // Realiza la carga de datos desde Firebase
  this.firestore.collection('ciudades').valueChanges().subscribe({
      next: (elementos: any[]) => {
          // Actualizar la lista de elementos en la vista
          this.cityList = elementos;
          console.log('10 3/4 Datos cargados desde Firebase:', this.cityList);

          // Marcar los datos como cargados
          this.dataLoaded = true;
      },
      error: (error: any) => {
          console.error('10 4/4 Error al cargar los datos desde Firebase:', error);

          // Manejar el error y configurar dataLoaded según corresponda
      }
  });
}

 editCity(city: any) {
  this.homeService.editMode = true;
  this.route.navigate(['/detail'],{state: {id:city.id, mode:'edit'}});
  console.log('11 editCity');
  }
}
    function loadData() {
    throw new Error('Function not implemented.');
  }


