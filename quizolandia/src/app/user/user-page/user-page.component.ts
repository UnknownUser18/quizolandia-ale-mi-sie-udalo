import { Component } from '@angular/core';
import { DatabaseService, User } from '../../database.service';

@Component({
    selector: 'app-user-page',
    imports: [],
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  protected result : User & any;
  constructor(private database : DatabaseService) {
    this.database.send('getUser', {username : localStorage.getItem('username')}, 'user').then(() : void => {
      const result = this.database.get_variable('user')![0];
      if(result === undefined) {
        alert('User not found');
        return;
      }
      this.result = result;
    });
  }
}
