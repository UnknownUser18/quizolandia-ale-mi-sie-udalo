import {ChangeDetectorRef, Component, ElementRef, ViewChild, NgZone} from '@angular/core';
import {Category, DatabaseService, QuestionType, WebSocketStatus} from '../../database.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { FormsModule } from '@angular/forms';
import { TransitionService } from '../../transition.service';

@Component({
  selector: 'app-quiz-create',
  imports: [
    FormsModule
  ],
  templateUrl: './quiz-create.component.html',
  styleUrl: './quiz-create.component.scss'
})
export class QuizCreateComponent {
  protected categories: Category[] = [];
  protected questions: any[] = [];
  protected showQuizPage : boolean = false;
  protected readonly QuestionType = QuestionType;
  protected form = {
    title: '',
    description: '',
    image: '',
    category: '',
    question: [] as {
      index_quiz: number;
      type: QuestionType;
      multipleChoice: boolean;
      hint: string;
      question: string;
      correctAnswers: string;
      answers: { index_answer: number; answer_name: string }[];
    }[],
  }
  protected quizForm = {
    type: QuestionType.TRUE_FALSE,
    multipleChoice : false,
    hint: '',
    question: '',
    answers: [],
  }
  @ViewChild('quizPage') quizPage!: ElementRef;
  @ViewChild('questionList') questionList!: ElementRef;

  get answerIndexes(): number[] {
    // TRUE_FALSE = 0, więc zawsze 2 opcje dla tego typu
    if (this.quizForm.type === QuestionType.TRUE_FALSE) {
      return [0, 1];
    }
    // Pozostałe typy: enum value + 2 (np. TWO_CHOICE = 1, więc 2 opcje)
    return Array(Number(this.quizForm.type) + 1).fill(0).map((_, i) => i);
  }

  onTypeOrModeChange() {
    this.quizForm = {
      ...this.quizForm,
      multipleChoice: this.quizForm.multipleChoice,
    };
    this.cdr.detectChanges();
  }

  constructor(
    private database : DatabaseService,
    private router: Router,
    private localStorage : LocalStorageService,
    private transition : TransitionService,
    private cdr : ChangeDetectorRef,
    private zone : NgZone) {
    this.localStorage.websocketStatus.subscribe((status) => {
      if (status !== WebSocketStatus.OPEN) return;
      this.localStorage.isLoggedin.subscribe((isLoggedin : boolean) => {
        // if (!isLoggedin) {
        //   this.router.navigate(['/']).then(() => {
        //     alert("Nie jesteś zalogowany!");
        //     return;
        //   });
        // }
        this.database.send('getCategoryName', {}, 'categoryList').then(() => {
          this.categories = this.database.get_variable('categoryList')!;
        });
      });
    });
  }
  protected closePage() : void {
    this.transition.animateWithTransitions(false, this.zone, this.quizPage.nativeElement).then(() => {
      this.showQuizPage = false;
    });
  }
  protected selectQuestion(index : number | null) : void {
    this.showQuizPage = true;
    this.cdr.detectChanges();
    this.transition.animateWithTransitions(true, this.zone, this.quizPage.nativeElement).then(() => {
      if (index === null) {
        this.quizForm = {
          type: QuestionType.TRUE_FALSE,
          multipleChoice: false,
          hint: '',
          question: '',
          answers: [],
        };
      } else {
        const question = this.form.question[index];
        this.quizForm = {
          type: question.type,
          multipleChoice: question.multipleChoice,
          hint: question.hint,
          question: question.question,
          answers: question.answers.map((answer: any) => answer.answer_name),
        };
        this.questionList.nativeElement.querySelectorAll('.question').forEach((questionElement: any, i: number) => {
          questionElement.firstElementChild.checked = question.correctAnswers.includes(i.toString());
          questionElement.lastElementChild.value = question.answers[i].answer_name;
        });
      }
      this.cdr.detectChanges();
    });
  }
  protected addAnswer() : void {
    console.log(this.quizForm);
    let correctAnswers = ''
    const answers: { index_answer: number; answer_name: string }[] = [];
    this.questionList.nativeElement.querySelectorAll('.question').forEach((question: any, index: number) => {
      const checked = question.firstElementChild.checked;
      if (checked)
        correctAnswers += index + ',';
      answers.push({
          index_answer: index,
          answer_name: question.lastElementChild.value,
      });
    });
    if (correctAnswers.endsWith(','))
      correctAnswers = correctAnswers.slice(0, -1);

    this.form.question.push({
      index_quiz: this.form.question.length + 1,
      type: this.quizForm.type,
      multipleChoice: this.quizForm.multipleChoice,
      hint: this.quizForm.hint,
      question: this.quizForm.question,
      correctAnswers: correctAnswers,
      answers: answers,
    });
    this.quizForm = {
      type: QuestionType.TRUE_FALSE,
      multipleChoice: false,
      hint: '',
      question: '',
      answers: [],
    };

  }
}
