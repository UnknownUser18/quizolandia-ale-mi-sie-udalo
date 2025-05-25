import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { Answers, DatabaseService, Questions, Solve, User, WebSocketStatus } from '../../database.service';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TransitionService } from '../../transition.service';
import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-quiz-results',
  imports: [
    NgClass,
    NgOptimizedImage,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './quiz-results.component.html',
  styleUrl: './quiz-results.component.scss'
})
export class QuizResultsComponent {
  private timeSpent : number = 0;
  protected userSession : any;
  protected quizName : string = '';
  protected quizId : string = '';
  protected formattedTimeSpent : string = '';
  protected showAnswerPanel : boolean = false;
  protected showRankingPanel : boolean = false;
  protected leaderboard : (Solve & User)[] = [];
  protected answers : Answers[] = [];
  protected questions : Questions[] = [];
  protected isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('answerPanel') answerPanel!: ElementRef;
  @ViewChild('rankingPanel') rankingPanel!: ElementRef;

  constructor(
    private localStorage : LocalStorageService,
    private database : DatabaseService,
    private router : Router,
    private title : Title,
    private zone : NgZone,
    private transition : TransitionService,
    private cdr : ChangeDetectorRef,
  ) {
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;
      this.localStorage.session.subscribe(session => {
        this.userSession = session;

        let startTime = this.userSession.startTime || new Date();
        let endTime = this.userSession.endTime || new Date();
        const timeDifference = endTime.getTime() - startTime.getTime();
        this.timeSpent = Math.floor(timeDifference / 100) / 10;

        const minutes = Math.floor(this.timeSpent / 60).toString();
        const seconds = Math.floor(this.timeSpent % 60).toString();
        this.formattedTimeSpent = `${minutes.padStart(2,'0')}:${seconds.padStart(2,'0')}:${Math.floor((this.timeSpent % 1) * 100)}`;

        this.quizId = this.router.url.split('/')[2]

        this.database.send('getQuizName', { id_quiz : this.quizId }, 'empty').then(() => {
          this.quizName = this.database.get_variable('empty')[0].quiz_name;
          this.title.setTitle(`Wyniki quizu - ${this.quizName}`);
          if (!(this.localStorage.get('username')) && this.localStorage.get('password')) {
            this.isLoggedIn.next(false);
          }
          this.database.send('checkUser', {username: this.localStorage.get('username'), password: this.localStorage.get('password')}, 'success').then(() => {
            this.isLoggedIn.next(this.database.get_variable('success')![0].userExists === 1);
            this.cdr.detectChanges();
          });
        });
      });
    });
  }

  protected async showAnswers() {
    this.showAnswerPanel = true;
    this.cdr.detectChanges();
    await this.transition.animateWithTransitions(true, this.zone, this.answerPanel.nativeElement);
    await this.database.send('getAnswers', { id_quiz: this.router.url.split('/')[2] }, 'answers');
    this.answers = this.database.get_variable('answers')!;
    await this.database.send('getQuestions', { id_quiz: this.router.url.split('/')[2] }, 'questions');
    this.questions = this.database.get_variable('questions')!;
  }

  protected async showRanking() {
    this.showRankingPanel = true;
    this.cdr.detectChanges();
    await this.transition.animateWithTransitions(true, this.zone, this.rankingPanel.nativeElement);
    await this.database.send('getLeaderboard', { id_quiz: this.router.url.split('/')[2] }, 'leaderboard');
    this.leaderboard = this.database.get_variable('leaderboard')!;
  }

  protected closeAnswerPanel() {
    this.transition.animateWithTransitions(false, this.zone, this.answerPanel.nativeElement).then(() => {
      this.showAnswerPanel = false;
    });
  }

  protected closeRankingPanel() {
    this.transition.animateWithTransitions(false, this.zone, this.rankingPanel.nativeElement).then(() => {
      this.showRankingPanel = false;
    });
  }

  protected filterAnswersByQuestion(questionId : number): Answers[] {
    return this.answers.filter(answer => answer.id_question === questionId);
  }

  protected containsAnswer(userSelected: string, id: string | number) : boolean {
    if (!userSelected) return false;
    const userAnswers = userSelected.split(',');
    return userAnswers.includes(id.toString());
  }

  protected correctAnswer(correct: string, id : number) : boolean {
    if (correct === '') return false;
    const correctAnswers = correct.split(',');
    return correctAnswers.includes(id.toString());
  }

  protected getTime(time : number) : string {
    let minutes = Math.floor(time / 60).toString();
    let seconds = Math.floor(time % 60).toString();
    let miliseconds = Math.floor((time - Math.floor(time)) * 1000).toString();
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}:${miliseconds.padStart(3, '0')}`;
  }

  protected async goBack(save : boolean) : Promise<void> {
    if(this.localStorage.get('username') && this.localStorage.get('password')) {
      await this.database.send('checkUser', {username: this.localStorage.get('username'), password: this.localStorage.get('password')}, 'success');
      if (this.database.get_variable('success')![0].userExists === 1) {
        await this.database.send('getUserID', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'empty');
        const id_user = this.database.get_variable('empty')[0].id_user;
        await this.database.send('insertSolve', { id_user: id_user, id_quiz: this.quizId, score: this.userSession.score, solveTime: this.timeSpent, isPublic: save }, 'empty');
      }

    }
    this.router.navigate(['/quiz', this.quizId]).then(() => {});
  }
}
