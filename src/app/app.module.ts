import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
    declarations: [AppComponent],

    imports: [BrowserModule, 
      IonicModule.forRoot(), 
      AppRoutingModule, 
      HttpClientModule, 
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      AngularFireAuthModule,

    ],

    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
    
    bootstrap: [AppComponent],

})
export class AppModule {}
