import { Component } from '@angular/core';
import {CommentsComponent} from '../comments/comments.component';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [
    CommentsComponent
  ],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {

}
