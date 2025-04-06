import { Component } from '@angular/core';
import { DatabaseService } from '../../database.service';
import {NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  constructor(private database: DatabaseService) {}
  comments : any | null = null;

  protected test() : void {
    this.database.getData('SELECT username, content, publicTime, avatar, stars FROM comments JOIN user ON comments.id_user = user.id_user;').then(() => {
      this.comments = this.database.result.value;
    });
  }
}
