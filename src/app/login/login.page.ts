import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy {
  public email = '';
  public password ='';
  public username:string = '';
 
       /* importamos el firebaseauth que es el servicio de signup e integrarlos con firebase
          tb importamos el router de angular y el toatController */
  constructor(
    private titleService:Title, 
    public fireAuth: AngularFireAuth, 
    public router:Router, 
    public toastController: ToastController) { }

  ngOnInit() {  }

  ngOnDestroy(): void {
    /*borra el título cuando se destruye el componente*/
    this.titleService.setTitle('');
  }

  attemptLogin(){
    this.fireAuth.signInWithEmailAndPassword(this.email, this.password)
    .then((userSignIn) => {
      /* acceso al login tras crear cuenta */
      console.log('25 Usuario creado correctamente:',userSignIn.user);
      let message ='Usuario creado correctamente'
      this.loginErrorToast(message);
      if(userSignIn.user){
      this.username = this.extractUsername(userSignIn.user.email);
        /* almacenamiento local del username */
      localStorage.setItem('username',this.username)
      this.titleService.setTitle(`Bienvenid@, ${this.username}`);
      }
      this.email='';
      this.password='';
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      /* info error por consola */
      console.error('26 Error al crear el usuario:',error);

      /* si ha ido mal limpiamos los campos */
      this.email='';
      this.password='';

      /*mensaje tipo de error*/
      let message = '';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no registrado';
          break;

        case 'auth/invalid-email':
          message = 'Usuario incorrecto';
          break;
                   
        case 'auth/invalid-credential':
          message = 'El usuario no existe o los datos introducidos son incorrectos';
          break;

        default:
          message = 'Error al iniciar sesión';
      }

      this.loginErrorToast(message);
                                    
    });
  }

  async loginErrorToast (message: string){
    const toastLogin = await this.toastController.create({
      message: message,
      duration:3000
    });
    toastLogin.present();
  }

  extractUsername(email: any) {
    const username = email.substring(0, email.indexOf('@'));
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
}

