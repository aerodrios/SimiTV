import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private router: Router) {

    const storedAuthState = localStorage.getItem('isAuthenticated');
    this.isAuthenticated = storedAuthState === 'true';

  }

  login(username: string, password: string): boolean {
    // Replace this logic with real authentication, such as calling an API
    if (username === 'user' && password === 'password') {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/calendar']);
      return true;
    } else {
      this.isAuthenticated = false;
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.setItem('isAuthenticated', 'false');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}