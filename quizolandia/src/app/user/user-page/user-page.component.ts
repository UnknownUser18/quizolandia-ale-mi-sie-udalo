import { Component } from '@angular/core';
import { DatabaseService, User } from '../../database.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  protected result : User & any;
  constructor(private database : DatabaseService) {
    this.database.getUserData(localStorage.getItem('username')!).then((r : User & any) => {
      this.result = r!;
    })
  }
}
