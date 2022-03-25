import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tmpStore : LocalstorageService;
  constructor() { }
  logout(): void {
    this.tmpStore.setItem('isLoggedIn', 'false');
    this.tmpStore.removeItem('token');
  }
}
