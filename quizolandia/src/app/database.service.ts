import { Injectable
} from '@angular/core';
import {LocalStorageService} from './local-storage.service';

/** @enum QuestionType
 * @description Typ pytania w quizie.
 * @enum {number} TRUE_FALSE - Pytanie prawda/fałsz.
 * @enum {number} TWO_CHOICE - Pytanie z dwiema odpowiedziami.
 * @enum {number} THREE_CHOICE - Pytanie z trzema odpowiedziami.
 * @enum {number} FOUR_CHOICE - Pytanie z czterema odpowiedziami.
 * @enum {number} FIVE_CHOICE - Pytanie z pięcioma odpowiedziami.
 * @enum {number} SIX_CHOICE - Pytanie z sześcioma odpowiedziami.
 * @example
 * const questionType: QuestionType = QuestionType.TWO_CHOICE;
 * console.log(questionType); // 1
 */
export enum QuestionType {
  TRUE_FALSE,
  TWO_CHOICE,
  THREE_CHOICE,
  FOUR_CHOICE,
  FIVE_CHOICE,
  SIX_CHOICE,
}

/** @enum ReportType
 * @description Typ zgłoszenia.
 * @enum {number} BUG - Zgłoszenie błędu.
 * @enum {number} CHEATING - Zgłoszenie oszustwa.
 * @enum {number} SUGGESTION - Zgłoszenie sugestii.
 * @enum {number} INAPPROPRIATE_CONTENT - Zgłoszenie nieodpowiedniej treści.
 * @enum {number} OTHER - Inne zgłoszenie.
 * @example
 * const reportType: ReportType = ReportType.BUG;
 * console.log(reportType); // 0
 */
export enum ReportType {
  BUG = 'bug',
  CHEATING = 'cheating',
  SUGGESTION = 'suggestion',
  INAPPROPRIATE = 'inappropriate',
  OTHER = 'other',
}

/** @enum Permission
 * @description Uprawnienia użytkownika.
 * @enum {number} USER - Użytkownik.
 * @enum {number} BANNED - Zbanowany użytkownik.
 * @enum {number} MODERATOR - Moderator.
 * @enum {number} ADMIN - Administrator.
 * @example
 * const permission: Permission = Permission.ADMIN;
 * console.log(permission); // 3
 */
export enum Permission {
  USER,
  BANNED,
  MODERATOR,
  ADMIN
}

export enum WebSocketStatus {
  CLOSED,
  OPEN,
  ERROR
}

/** @interface User
 *  @description Obiekt reprezentujący użytkownika w bazie danych.
 *  @property {number} id_User - Unikalny identyfikator użytkownika.
 *  @property {string} name - Imię i nazwisko użytkownika.
 *  @property {string} email - Adres e-mail użytkownika.
 *  @property {string} password - Hasło użytkownika.
 *  @property {string} avatar - Ścieżka URL do awatara użytkownika.
 *  @property {Date} lastlogin - Data ostatniego logowania użytkownika.
 *  @property {Date} acccreation - Data utworzenia konta użytkownika.
 *  @property {Permission} permission - Uprawnienia użytkownika.
 *  @example
 *  const user: User = {
 *  id_User: 1,
 *  username: 'Jan Kowalski',
 *  email: 'janek@srebnoreki.pl',
 *  password: 'haslo123',
 *  avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpreview.redd.it%2Fliteralnie-cibab-v0-jzrcwke4bslc1.jpeg%3Fauto%3Dwebp%26s%3De8a5241bcaa74a46978a78451db6651d6ce21806&f=1&nofb=1&ipt=1bbfa37bdbf81dd2123db5b6032c7377fe000a8036e703bd0019c8bb6b116fb1&ipo=images',
 *  nationality: 'Poland',
 *  lastlogin: '2023-01-01T12:00:00Z',
 *  acccreation: '2023-01-01T12:00:00Z',
 *  permission: Permission.USER,
 *  }
 */
export interface User {
  id_User: number,
  username: string,
  email: string,
  password: string,
  avatar: string,
  nationality: string,
  lastlogin: string,
  acccreation: string,
  permission: Permission,
}

/** @interface Quiz
 * @description Obiekt reprezentujący quiz w bazie danych.
 * @property {number} id_quiz - Unikalny identyfikator quizu.
 * @property {string} quiz_name - Nazwa quizu.
 * @property {string} description - Opis quizu.
 * @property {string} image - Ścieżka URL do obrazu quizu.
 * @property {number} createdBy - Identyfikator użytkownika, który stworzył quiz.
 * @property {Date} creationDate - Data utworzenia quizu.
 * @property {Date} lastUpdate - Data ostatniej aktualizacji quizu.
 * @property {boolean} isPublic - Czy quiz jest publiczny, czy jako wersja robocza.
 * @property {number} id_category - Identyfikator kategorii quizu.
 * @example
 * const quiz: Quiz = {
 *  id_quiz: 1,
 *  quiz_name: 'Quiz o programowaniu',
 *  description: 'Sprawdź swoją wiedzę o programowaniu',
 *  image: 'https://example.com/quiz-image.jpg',
 *  questions: [
 *    {
 *      question: 'Co to jest programowanie?',
 *      type: QuestionType.TRUE_FALSE,
 *      multipleChoice: false,
 *      answers: ['Tak', 'Nie'],
 *      correctAnswer: 0,
 *      hint: 'Programowanie to proces tworzenia programów komputerowych',
 *    },
 *  ],
 *  createdBy: 1,
 *  creationDate: new Date('2023-10-01'),
 *  lastUpdate: new Date('2023-10-01'),
 *  isPublic: true,
 *  id_category: 1,
 * }
 */
export interface Quiz {
  id_quiz: number,
  quiz_name: string,
  description: string,
  image: string,
  createdBy: User["id_User"],
  creationDate: Date,
  lastUpdate: Date,
  isPublic: boolean,
  id_category: Category["id_category"],
  difficulty: number,
}
export interface Questions {
  id_questions: number,
  id_quiz: Quiz["id_quiz"],
  index_quiz: number,
  question: string,
  type: QuestionType,
  multipleChoice: boolean,
  correctAnswers: string, // Przechowuje indeksy poprawnych odpowiedzi jako string, np. "0,2" dla dwóch poprawnych odpowiedzi
  hint: string,
}
export interface Answers {
  id_answer: number,
  id_question: Questions["id_questions"],
  index_answer: number,
  answer_name: string,
}

/** @interface Report
 * @description Obiekt reprezentujący zgłoszenie w bazie danych.
 * @property {number} id_report - Unikalny identyfikator zgłoszenia.
 * @property {number} id_user - Identyfikator użytkownika, który zgłosił problem.
 * @property {ReportType} type - Typ zgłoszenia.
 * @property {string} description - Opis zgłoszenia.
 * @property {Date} date - Data zgłoszenia.
 * @example
 *  const report: Report = {
 *  id_report: 1,
 *  id_user: 1,
 *  type: ReportType.BUG,
 *  description: 'Zgłoszenie błędu w quizie',
 *  date: new Date('2023-10-01'),
 * }
 */
export interface Report {
  id_report: number,
  id_user: User["id_User"],
  type: ReportType,
  description: string,
  date: Date,
}

/** @interface Solve
 * @description Obiekt reprezentujący rozwiązanie quizu przez użytkownika.
 * @property {number} id_solve - Unikalny identyfikator rozwiązania.
 * @property {number} id_quiz - Identyfikator quizu, który został rozwiązany.
 * @property {number} id_user - Identyfikator użytkownika, który rozwiązał quiz.
 * @property {number} score - Wynik użytkownika w quizie.
 * @property {number} solveTime - Czas rozwiązania quizu w sekundach.
 * @property {Date} whenSolve - Data rozwiązania quizu.
 * @property {boolean} isPublic - Czy wynik jest publiczny, czy prywatny.
 * @example
 *  const solve: Solve = {
 *  id_solve: 1,
 *  id_quiz: 1,
 *  id_user: 1,
 *  score: 80,
 *  solveTime: 120,
 *  whenSolve: new Date('2023-10-01'),
 *  isPublic: true,
 * }
 */
export interface Solve {
  id_solve: number,
  id_quiz: Quiz["id_quiz"],
  id_user: User["id_User"],
  score: number,
  solveTime: number,
  whenSolve: Date,
  isPublic: boolean,
}

/** @interface Category
 * @description Obiekt reprezentujący kategorię quizu.
 * @property {number} id_category - Unikalny identyfikator kategorii.
 * @property {string} name - Nazwa kategorii.
 * @property {string} description - Opis kategorii.
 * @example
 *  const category: Category = {
 *  id_category: 1,
 *  name: 'Programowanie',
 *  description: 'Kategoria dotycząca programowania i technologii informacyjnych',
 * }
 */
export interface Category {
  id_category: number,
  category_name: string,
  description: string,
}

/** @interface Comment
 * @description Obiekt reprezentujący komentarz do quizu.
 * @property {number} id_comment - Unikalny identyfikator komentarza.
 * @property {number} id_user - Identyfikator użytkownika, który dodał komentarz.
 * @property {number} id_quiz - Identyfikator quizu, do którego dodano komentarz.
 * @property {string} content - Treść komentarza.
 * @property {Date} publicTime - Data dodania komentarza.
 * @property {number} stars - Ocena komentarza w skali 1-5.
 * @example
 * const comment: Comment = {
 *  id_comment: 1,
 *  id_user: 1,
 *  id_quiz: 1,
 *  content: 'Bardzo dobry quiz!',
 *  publicTime: new Date('2023-10-01'),
 *  stars: 5,
 * }
 */
export interface Comment {
  id_comment: number,
  id_user: User["id_User"],
  id_quiz: Quiz["id_quiz"],
  content: string,
  publicTime: string,
  stars: number,
}

type variables = {
  quizzesList? : (Quiz & Category)[],
  quizzesFromToday? : (Quiz & Category)[],
  quizzesFromWeekend? : (Quiz & Category)[],
  quiz? : (User & Quiz & Category),
  categoryList? : Category[],
  commentsList? : (Comment & User)[],
  scoresList? : (Solve & User)[],
  user? : (User & any),
  empty? : any,
  success? : any,
  leaderboard? : (Solve & User)[],
  questions? : (Questions)[],
  answers? : Answers[],
}

type variableName = keyof variables;

export async function checkUser(d : DatabaseService) : Promise<boolean> {
  if(!(d.localStorage.get('username') || d.localStorage.get('password'))) return false;
  await d.send('checkUser', { username: d.localStorage.get('username'), password: d.localStorage.get('password') }, 'success');
  return d.get_variable('success')![0].userExists === 1;
}


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(public localStorage : LocalStorageService) {}
  private socket! : WebSocket;
  private variables : Map<variableName, any> = new Map<variableName, any>();
  public async initWebSocket() : Promise<WebSocketStatus> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () : void => {
          console.log('WebSocket connection established');
          resolve(WebSocketStatus.OPEN);
        };
        this.socket.onerror = (error : Event) : void => {
          console.error('WebSocket error:', error);
          reject(WebSocketStatus.ERROR);
        };
        this.socket.onclose = () : void => {
          console.log('WebSocket connection closed');
          resolve(WebSocketStatus.CLOSED);
        };
      } catch (error) {
        console.error('WebSocket error:', error);
        reject(WebSocketStatus.ERROR);
      }
    });
  }
  /**
   * @method get
   * @description Metoda do pobierania danych z serwera WebSocket.
   * @param query_name - Nazwa zapytania do serwera.
   * @param params - Parametry zapytania (opcjonalna).
   * @param variable - Nazwa zmiennej, do której zostaną przypisane pobrane dane.
   * @returns Zwraca obiekt z danymi pobranymi z serwera.
   * @throws {Error} W przypadku błędu podczas komunikacji z serwerem.
   * @example
   * const data = await this.get('getQuizzes', { quiz_name: 'Quiz 1' }, 'quizzesList');
   */
  public async send(query_name: string, params: any, variable: variableName): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({ type: query_name, params: params }));
      this.socket.onmessage = (event: MessageEvent) => {
        console.log('WebSocket message received:');
        console.table(JSON.parse(event.data));
        const data = JSON.parse(event.data);
        this.variables.set(variable, data);
        resolve(true);
      };
      this.socket.onerror = (error : Event) : void => {
        reject(new Error('WebSocket error occurred', error as ErrorOptions));
      };
    });
  }

  /**
   * @method get_variable
   * @description Metoda do pobierania zmiennej z mapy.
   * @param variable - Nazwa zmiennej do pobrania.
   * @returns Zwraca wartość zmiennej lub undefined, jeśli zmienna nie istnieje.
   * @example
   * const quizzes = this.get_variable('quizzesList');
   * @throws {Error} W przypadku błędu podczas pobierania zmiennej.
   */
  public get_variable<T extends variableName>(variable : T) : variables[T] | undefined {
    return this.variables.get(variable);
  }
}
