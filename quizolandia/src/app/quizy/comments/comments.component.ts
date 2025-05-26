import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, DatabaseService, User, WebSocketStatus, checkUser } from '../../database.service';
import { LocalStorageService } from '../../local-storage.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-comments',
  imports: [
    NgOptimizedImage,
    FormsModule,
    AsyncPipe
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

  constructor(private database: DatabaseService, protected localStorage : LocalStorageService, private cdr : ChangeDetectorRef) {}


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

  protected getTimeRelativeObservable(date : string) {
    return interval(1000).pipe(
      startWith(0),
      map(() => this.getTimeRelative(date))
    );
  }

  protected async addComment() {
    checkUser(this.database).then(async (r) : Promise<void> => {
      if (!r) return;
      this.form.content = this.form.content.trim().slice(0, 254) || '';
      if (this.form.content.length === 0) return;
      await this.database.send('getUserID', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'user');
      const user : number = this.database.get_variable('user')[0].id_user;
      const date = new Date();
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      await this.database.send('addComment', { id_quiz: this.quizId, id_user: user, content: this.form.content, publicTime: dateString, stars: this.form.star }, 'success');
      await this.database.send('getCommentsFromQuiz', { id_quiz: this.quizId }, 'commentsList');
      this.comments = this.database.get_variable('commentsList')!;
      this.form.content = '';
      this.form.star = 5;
    });
  }

  protected deleteComment(id_comment : number) : void {
    checkUser(this.database).then((r) : void => {
      if (!r) return;
      this.database.send('deleteComment', { id_comment: id_comment }, 'success').then(() : void => {
        this.database.send('getCommentsFromQuiz', {id_quiz: this.quizId}, 'commentsList').then(() => {
          this.comments = this.database.get_variable('commentsList')!;
        });
      });
    })
  }
  public ngOnChanges(changes: SimpleChanges) {
    if(changes['quizId'] && changes['quizId'].currentValue !== undefined) {
      this.localStorage.websocketStatus.subscribe((status) => {
        if (status !== WebSocketStatus.OPEN) return;
        this.database.send('getCommentsFromQuiz', { id_quiz: changes['quizId'].currentValue }, 'commentsList').then(() : void => {
          this.comments = this.database.get_variable('commentsList')!;
          checkUser(this.database).then((r) : void => {
            this.isLoggedIn = r;
            this.cdr.detectChanges();
          });
        });
      })
    }
  }
}
