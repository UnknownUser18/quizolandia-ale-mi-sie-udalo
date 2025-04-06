import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, User, DatabaseService } from '../../database.service';
import { NgForOf, NgOptimizedImage } from '@angular/common';

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
export class CommentsComponent implements OnChanges {
  constructor(private database: DatabaseService) {}
  comments : Array<Comment & User> | null = null;
  @Input() quizId!: number | undefined;
  public ngOnChanges(changes: SimpleChanges) {
    if(changes['quizId'] && changes['quizId'].currentValue !== undefined) {
      setTimeout(() : void => {
        this.database.getData(`SELECT username, content, publicTime, avatar, stars FROM comments JOIN user ON comments.id_user = user.id_user WHERE id_quiz = ${changes['quizId'].currentValue};`).then(() => {
          this.comments = this.database.result.value;
        });
      }, 1000);
    }
  }
}
