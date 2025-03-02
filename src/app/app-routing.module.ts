import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
        /* para que la pantalla de login sea la ruta por defecto se debe poner aquí:
  {    path: '',    redirectTo: 'home',    pathMatch: 'full'  }, 
        en lugar de redirigir a home redirigiremos a login = abrir la app desde "0"*/
  {    path: '',    redirectTo: 'login',    pathMatch: 'full'  },
  {    path: 'home',    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)  },
  {    path: 'login',    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)  },
      /* aquí definimos una variable en: path: 'detail' para ver el texto del item  */
  {    path: 'detail/:text',    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)  },
  {    path: 'detail/:id',    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)},
  {    path: 'detail',    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)  },
  {    path: 'detail/:id/edit',   loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule) },
  {    path: 'signup', loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
