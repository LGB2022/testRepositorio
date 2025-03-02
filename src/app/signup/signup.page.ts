import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  public email = '';
  public password ='';
  toastSignup: any;
  
      /* importamos el firebaseauth que es el servicio de signup e integrarlos con firebase
      tb importamos el router de angular */
  constructor(
    public fireAuth: AngularFireAuth, 
    public router:Router,
    public toastController: ToastController) { }

  ngOnInit() {  }

    /* llamamos a la función signup() de createUser con email/Passw  */
  public signup(){
        this.fireAuth.createUserWithEmailAndPassword(this.email, this.password)
            .then((userCredential) => {
              /* acceso al login tras crear cuenta */
              console.log('27 Usuario creado correctamente:',userCredential.user);

              let message='Usuario creado correctamente';
              this.signupErrorToast(message);                                                                                                                /* ALERT */
              this.router.navigate(['/login']);
            })
     .catch((error) => {
      /* info error por consola */
      console.error('26 Error al crear el usuario:',error);
     // let message ='Error al crear el usuario';
      //  this.signupErrorToast(message); 

      /* si ha ido mal limpiamos los campos */
      this.email='';
      this.password='';

      let message:string='';

      /*mensaje tipo de error*/
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Usuario ya registrado';
          break;

        case 'auth/invalid-email':
          message = 'Usuario incorrecto';
          break;
                   
        case 'auth/missing-password':
          message = 'Password incorrecto';
          break
          
        default:
          message = 'Error al crear usuario';
      }
       // message='Introduzca los datos correctos';
        this.signupErrorToast(message);  
    });

  }

  async signupErrorToast (message: string){
    const toastSignup = await this.toastController.create({
      message: message,
      duration:3000
    });
    toastSignup.present();
  }
  
}
