import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, DatabaseService, User, WebSocketStatus } from '../../database.service';
import { LocalStorageService } from '../../local-storage.service';
import { NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [
    NgOptimizedImage,
    FormsModule
  ],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnChanges {
  protected comments : Array<Comment & User> | null = null;
  protected isLoggedIn: boolean = false;

  protected form = {
    star: 5,
    content: ''
  }
  @Input() quizId!: number | undefined;

  constructor(private database: DatabaseService, private localStorage : LocalStorageService, private cdr : ChangeDetectorRef) {}


  protected getTime(date : string) : string {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  }

  protected getTimeRelative(date: string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = now.getTime() - commentDate.getTime();

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return seconds === 1 ? 'Sekundę temu' : `${seconds} sekund temu`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? 'Minutę temu' : `${minutes} minut temu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? 'Godzinę temu' : `${hours} godzin temu`;

    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? 'Wczoraj' : `${days} dni temu`;

    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? 'Miesiąc temu' : `${months} miesięcy temu`;

    const years = Math.floor(months / 12);
    if (years === 1) return years === 1 ? 'Rok temu' : `${years} lata temu`;
    return `${years} lat temu`;
  }

  protected addComment() {
    if(!(this.localStorage.get('username') || this.localStorage.get('password'))) {
      return;
    }
    this.database.send('checkUser', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'success').then(() : void => {
      if(this.database.get_variable('success')![0].userExists !== 1) return;
      this.database.send('addComment', { id_quiz: this.quizId })
    });
  }
  public ngOnChanges(changes: SimpleChanges) {
    if(changes['quizId'] && changes['quizId'].currentValue !== undefined) {
      this.localStorage.websocketStatus.subscribe((status) => {
        if (status !== WebSocketStatus.OPEN) return;
        this.database.send('getCommentsFromQuiz', { id_quiz: changes['quizId'].currentValue }, 'commentsList').then(() : void => {
          this.comments = this.database.get_variable('commentsList')!;
          if(!(this.localStorage.get('username') || this.localStorage.get('password'))) {
            this.isLoggedIn = false;
            return;
          }
          this.database.send('checkUser', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'success').then(() : void => {
            this.isLoggedIn = this.database.get_variable('success')![0].userExists === 1;
            this.cdr.detectChanges();
          });
        });
      })
    }
  }
}
