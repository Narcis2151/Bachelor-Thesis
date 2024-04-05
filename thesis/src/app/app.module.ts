import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { HlmButtonDirective } from '../../components/ui-button-helm/src';

@NgModule({
  declarations: [AppComponent, AuthComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HlmButtonDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
