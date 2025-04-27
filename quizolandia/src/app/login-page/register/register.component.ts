import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: '../login-page.scss'
})
export class RegisterComponent {
  protected username : string = '';
  protected password : string = '';
  protected email : string = '';
  protected password_repeat : string = '';
  constructor(private database : DatabaseService, private router : Router) {}

  protected register() : void {
    if(this.password !== this.password_repeat) {
      alert('Passwords do not match');
      return;
    }
    if(this.username.length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }
    if(this.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if(!this.email.includes('@')) {
      alert('Email is not valid');
      return;
    }
    if(!this.email.includes('.')) {
      alert('Email is not valid');
      return;
    }
    if(this.username.includes(' ')) {
      alert('Username cannot contain spaces');
      return;
    }
    if(this.password.includes(' ')) {
      alert('Password cannot contain spaces');
      return;
    }
    if(this.email.includes(' ')) {
      alert('Email cannot contain spaces');
      return;
    }
    let date: Date = new Date();
    let date_sql : string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    this.database.send('insertUser', {email : this.email, username : this.username, password : this.password, accDate : date_sql}, 'success').then(() : void => {
      const result = this.database.get_variable('success')![0];
      if(!!result[result.length - 2].affectedRows) {
        alert('User registered successfully');
        this.router.navigate(['/login']).then();
      } else {
        alert('User already exists');
      }
    })
  }
}
