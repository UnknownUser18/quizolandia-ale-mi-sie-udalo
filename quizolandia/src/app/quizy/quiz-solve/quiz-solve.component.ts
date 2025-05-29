import { ChangeDetectorRef, Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService, Questions, Answers, WebSocketStatus } from '../../database.service';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from '../../local-storage.service';
import {TransitionService} from '../../transition.service';

@Component({
    selector: 'app-quiz-solve',
    imports: [],
    templateUrl: './quiz-solve.component.html',
    styleUrl: './quiz-solve.component.scss'
})
export class QuizSolveComponent {
  private userSession = {
    score: 0,
    difficulty: 0,
    startTime: new Date(),
    endTime: new Date() || undefined,
    streak : 0,
    usedHint: false,
    selectedAnswers: [''],
    correctAnswers: 0
  }
  protected questions : Questions[] = [];
  protected quizId : number | undefined;
  protected answers : Answers[] = [];
  protected currentQuestionIndex : number = 0;
  protected currentQuestion : Questions | undefined;
  protected quizName : string | undefined;
  protected showHintPanel : boolean = false;

  @ViewChild('hintPanel') hintPanel!: ElementRef;
  constructor(
    private router : Router,
    private title : Title,
    private database : DatabaseService,
    private localStorage : LocalStorageService,
    private cdr : ChangeDetectorRef,
    private transition : TransitionService,
    private zone : NgZone
  ) {
    const urlSegments: string[] = this.router.url.split('/');

    this.quizId = parseInt(urlSegments[urlSegments.length - 2], 10);
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;
      this.database.send('getQuizName', { quizId: this.quizId }, 'empty').then(() => {
        this.quizName = this.database.get_variable("empty")![0].quiz_name;
        this.userSession.difficulty = this.database.get_variable("empty")![0].difficulty;
        this.title.setTitle('Rozwiązywanie quizu - ' + this.quizName);

        this.database.send('getQuestions', {quizId: this.quizId}, 'questions').then(() => {
          this.questions = this.database.get_variable("questions")!;

          this.database.send('getAnswers', {quizId: this.quizId}, 'answers').then(() => {
            this.answers = this.database.get_variable("answers")!;
            this.currentQuestion = this.questions[this.currentQuestionIndex];
          });
        });
      });
    });
  }
  protected nextQuestion() : void {
    if (this.currentQuestionIndex === this.questions.length - 1) {
      this.userSession.endTime = new Date();
      this.router.navigate(['/quiz', this.quizId, 'result']).then(() => {
        this.localStorage.session.next(this.userSession);
        return;
      });
    }
    if(this.userSession.selectedAnswers[this.currentQuestionIndex] === undefined) this.userSession.selectedAnswers[this.currentQuestionIndex] = '';
    let score = 0;
    switch (this.userSession.difficulty) {
      case 1: // easy
        score = 10;
        break;
      case 2: // medium
        score = 15;
        break;
      case 3: // hard
        score = 20;
        break;
    }
    if (this.userSession.usedHint) score = Math.floor(score / 2);
    if (this.userSession.selectedAnswers[this.currentQuestionIndex] === this.currentQuestion?.correctAnswers) {
      if( this.userSession.streak >= 8 )
        score += 10;
      else if( this.userSession.streak >= 3 )
        score += 5;
      this.userSession = {
        ...this.userSession,
        score: this.userSession.score + score,
        correctAnswers: this.userSession.correctAnswers + 1,
        streak: this.userSession.streak + 1
      }
    } else {
      this.userSession.streak = 0;
    }
    this.userSession.usedHint = false;
    this.currentQuestionIndex++;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.cdr.detectChanges();
  }

  protected showHint() : void {
    this.userSession.usedHint = true;
    this.showHintPanel = true;
    this.cdr.detectChanges();
    this.transition.animateWithTransitions(true, this.zone, this.hintPanel.nativeElement).then();
  }

  protected closeHintPanel() : void {
    this.transition.animateWithTransitions(false, this.zone, this.hintPanel.nativeElement).then(() : void => {
      this.showHintPanel = false;
    });
  }

  protected selectAnswer(index_answer : number) : void {
    if(this.userSession.selectedAnswers[this.currentQuestionIndex] === undefined) this.userSession.selectedAnswers[this.currentQuestionIndex] = '';
    if(this.currentQuestion?.multipleChoice) {
      const selectedAnswers : string[] = this.userSession.selectedAnswers[this.currentQuestionIndex].split(',');
      if (selectedAnswers.includes(index_answer.toString())) {
        selectedAnswers.splice(selectedAnswers.indexOf(index_answer.toString()), 1);
      } else {
        selectedAnswers.push(index_answer.toString());
      }
      selectedAnswers.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      this.userSession.selectedAnswers[this.currentQuestionIndex] = selectedAnswers.filter(ans => ans !== '').join(',');
    } else {
      this.userSession.selectedAnswers[this.currentQuestionIndex] = index_answer.toString();
    }
  }

  protected filterAnswersByQuestion(id_questions: number): Answers[] {
    return this.answers.filter(answer => answer.id_question === id_questions);
  }

}
