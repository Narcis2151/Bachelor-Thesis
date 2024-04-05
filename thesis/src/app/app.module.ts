import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { HlmButtonDirective } from '../../components/ui-button-helm/src';
import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, LoadingSpinnerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HlmButtonDirective,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
