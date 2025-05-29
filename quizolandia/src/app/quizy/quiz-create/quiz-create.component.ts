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
  protected indexQuiz : number | null = null;
  protected showQuizPage : boolean = false;
  protected readonly QuestionType = QuestionType;
  protected form = {
    title: '',
    description: '',
    image: '',
    category: '',
    difficulty: 1, // 1 - easy, 2 - medium, 3 - hard
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
  protected quizForm: {
    type: QuestionType;
    multipleChoice: boolean;
    hint: string;
    question: string;
    answers: string[];
  } = {
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
    // Ustal liczbę odpowiedzi na podstawie typu pytania
    const answerCount = this.quizForm.type === QuestionType.TRUE_FALSE ? 2 : Number(this.quizForm.type) + 1;
    this.quizForm = {
      ...this.quizForm,
      answers: Array(answerCount).fill(''),
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
        if (!isLoggedin) {
          this.router.navigate(['/']).then(() => {
            alert("Nie jesteś zalogowany!");
            return;
          });
        }
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
      let answerCount: number;
      if (index === null) {
        // Nowe pytanie
        answerCount = this.quizForm.type === QuestionType.TRUE_FALSE ? 2 : Number(this.quizForm.type) + 1;
        this.quizForm = {
          type: QuestionType.TRUE_FALSE,
          multipleChoice: false,
          hint: '',
          question: '',
          answers: Array(answerCount).fill(''),
        };
      } else {
        const question = this.form.question[index];
        this.indexQuiz = index;
        answerCount = question.type === QuestionType.TRUE_FALSE ? 2 : Number(question.type) + 1;
        // Uzupełnij odpowiedzi do wymaganej długości
        const answers = question.answers.map((answer: any) => answer.answer_name);
        while (answers.length < answerCount) answers.push('');
        this.quizForm = {
          type: question.type,
          multipleChoice: question.multipleChoice,
          hint: question.hint,
          question: question.question,
          answers: answers,
        };
        setTimeout(() => {
          this.questionList.nativeElement.querySelectorAll('.question').forEach((questionElement: any, i: number) => {
            questionElement.firstElementChild.checked = question.correctAnswers.includes(i.toString());
            questionElement.lastElementChild.value = answers[i];
          });
        }, 500);
      }
      this.cdr.detectChanges();
    });
  }
  protected addAnswer() : void {
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
    if (this.indexQuiz !== null) {
      this.form.question[this.indexQuiz] = {
        index_quiz: this.indexQuiz,
        type: this.quizForm.type,
        multipleChoice: this.quizForm.multipleChoice,
        hint: this.quizForm.hint,
        question: this.quizForm.question,
        correctAnswers: correctAnswers,
        answers: answers,
      };
    } else {
      this.form.question.push({
        index_quiz: this.form.question.length,
        type: this.quizForm.type,
        multipleChoice: this.quizForm.multipleChoice,
        hint: this.quizForm.hint,
        question: this.quizForm.question,
        correctAnswers: correctAnswers,
        answers: answers,
      });
    }
    this.quizForm = {
      type: QuestionType.TRUE_FALSE,
      multipleChoice: false,
      hint: '',
      question: '',
      answers: [],
    };
    this.indexQuiz = null;
  }

  protected async publishQuiz() : Promise<void> {
    if (this.form.title === '' || this.form.description === '' || this.form.category === '' || this.form.image === '') {
      alert('Wypełnij wszystkie pola!');
      return;
    }
    if (this.form.question.length === 0) {
      alert('Dodaj przynajmniej jedno pytanie!');
      return;
    }
    await this.database.send('getUserID', {username: this.localStorage.get('username'), password: this.localStorage.get('password')}, 'empty');
    const userId = this.database.get_variable('empty')![0].id_user;
    await this.database.send('insertQuiz', {
      name: this.form.title,
      description: this.form.description,
      id_category: this.form.category,
      createdBy: userId,
      image: this.form.image,
      isPublic: true,
      difficulty: this.form.difficulty
    }, 'empty');
    const quizId = this.database.get_variable('empty')!.insertId;
    for (const question of this.form.question) {
      await this.database.send('insertQuestions', {
        index_quiz: question.index_quiz,
        question: question.question,
        type: QuestionType[question.type],
        multipleChoice: question.multipleChoice,
        correctAnswers: question.correctAnswers,
        hint: question.hint,
        id_quiz: quizId
      }, 'empty');
      const questionId = this.database.get_variable('empty')!.insertId;
      for (const answer of question.answers) {
        await this.database.send('insertAnswers', {
          id_question: questionId,
          index_answer: answer.index_answer,
          answer_name: answer.answer_name
        }, 'empty');
      }
    }
  }
}
