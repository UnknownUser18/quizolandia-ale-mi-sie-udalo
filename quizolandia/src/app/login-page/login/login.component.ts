import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected username: string = '';
  protected password: string = '';

  constructor(protected router : Router, private database : DatabaseService) {}

  login() : void {
    if(this.username === '' || this.password === '') {
      throw new Error(`${this.username} and ${this.password} is required`);
    }
    this.database.checkLogin(this.username, this.password).then((result : boolean) : void => {
      if (result) {
        localStorage.setItem('username', this.username);
        alert('Login successful');
        this.router.navigate(['']).then();
      } else {
        alert('Login failed');
      }
    });
  }
}
