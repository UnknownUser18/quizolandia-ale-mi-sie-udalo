import { Injectable
} from '@angular/core';

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
  BUG,
  CHEATING,
  SUGGESTION,
  INAPPROPRIATE,
  OTHER,
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
/** @interface User
 *  @description Obiekt reprezentujący użytkownika w bazie danych.
 *  @property {number} id_User - Unikalny identyfikator użytkownika.
 *  @property {string} name - Imię i nazwisko użytkownika.
 *  @property {string} email - Adres e-mail użytkownika.
 *  @property {string} password - Hasło użytkownika.
 *  @property {string} avatar - Ścieżka URL do awatara użytkownika.
 *  @property {Date} lastLogin - Data ostatniego logowania użytkownika.
 *  @property {Date} accCreation - Data utworzenia konta użytkownika.
 *  @property {Permission} permission - Uprawnienia użytkownika.
 *  @example
 *  const user: User = {
 *  id_User: 1,
 *  username: 'Jan Kowalski',
 *  email: 'janek@srebnoreki.pl',
 *  password: 'haslo123',
 *  avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpreview.redd.it%2Fliteralnie-cibab-v0-jzrcwke4bslc1.jpeg%3Fauto%3Dwebp%26s%3De8a5241bcaa74a46978a78451db6651d6ce21806&f=1&nofb=1&ipt=1bbfa37bdbf81dd2123db5b6032c7377fe000a8036e703bd0019c8bb6b116fb1&ipo=images',
 *  nationality: 'Poland',
 *  lastLogin: new Date('2023-10-01'),
 *  accCreation: new Date('2023-01-01'),
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
  lastLogin: Date,
  accCreation: Date,
  permission: Permission,
}

/** @interface Quiz
 * @description Obiekt reprezentujący quiz w bazie danych.
 * @property {number} id_quiz - Unikalny identyfikator quizu.
 * @property {string} quiz_name - Nazwa quizu.
 * @property {string} description - Opis quizu.
 * @property {string} image - Ścieżka URL do obrazu quizu.
 * @property {Questions[]} questions - JSON z pytaniami w quizie.
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
  questions: Questions[],
  createdBy: User["id_User"],
  creationDate: Date,
  lastUpdate: Date,
  isPublic: boolean,
  id_category: Category["id_category"],
}

/** @interface Questions
 * @description Obiekt reprezentujący pytanie w quizie.
 * @property {string} question - Treść pytania.
 * @property {QuestionType} type - Typ pytania.
 * @property {boolean} multipleChoice - Czy pytanie ma wiele odpowiedzi.
 * @property {string[]} answers - Tablica z odpowiedziami.
 * @property {string} correctAnswer - Poprawna odpowiedź, zapisywana jako indeks do tablicy answers.
 * @property {string} hint - Podpowiedź do pytania.
 * @example
 *  const question: Questions = {
 *  question: 'Co to jest programowanie?',
 *  type: QuestionType.THREE_CHOICE,
 *  multipleChoice: true,
 *  answers: ['Programowanie', 'Program', 'Programista'],
 *  correctAnswer: '2,3',
 *  hint: 'Programowanie to proces tworzenia programów komputerowych',
 * }
 */
export interface Questions {
  question : string,
  type: QuestionType,
  multipleChoice: boolean,
  answers: string[],
  correctAnswer: string,
  hint: string,
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
 * @example
 *  const category: Category = {
 *  id_category: 1,
 *  name: 'Programowanie',
 * }
 */
export interface Category {
  id_category: number,
  category_name: string,
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
  publicTime: Date,
  stars: number,
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() {}
  private socket! : WebSocket;
  public initWebSocket() : number {
    try {
      this.socket = new WebSocket('ws://localhost:8080');
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        return 0;
      };
      this.socket.onerror = (error : Event) => {
        console.error('WebSocket error:', error);
        return 1;
      };
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        return 0;
      };
    } catch (error) {
      console.error('WebSocket error:', error);
      return 1;
    }
    return 2;
  }
  private async sendData(type : string, data : any | null) : Promise<Array<any>> {
    if(!this.socket.readyState) throw new Error('WebSocket connection does not exist');
    this.socket.send(JSON.stringify({type, data}));
    return new Promise((resolve, reject) : void => {
      this.socket.onmessage = (event : MessageEvent) => {
        if(!event.data) {
          reject(new Error('Error in data', event.data));
          return;
        }
        console.log('WebSocket message received:', event.data);
        resolve(JSON.parse(event.data));
      }
    });
  }
  public async getCategoryName() : Promise<Category[]> {
    try {
      return await this.sendData('getCategoryName', null);
    } catch (error) {
      console.error('Error getting category name:', error);
      return [];
    }
  }
  public async getCommentsFromQuiz(id_quiz: number): Promise<(Comment & User)[]> {
    try {
      return await this.sendData('getCommentsFromQuiz', id_quiz);
    } catch (error) {
      console.error('Error getting comments from quiz:', error);
      return [];
    }
  }
  public async getQuizzes(quiz_name : string, category_name : string | null) : Promise<(User & Quiz & Category)[]> {
    try {
      return await this.sendData('getQuizzes', {quiz_name, category_name});
    } catch (error) {
      console.error('Error getting quizzes:', error);
      return [];
    }
  }
  public async getQuiz(id_quiz : number) : Promise<(User & Quiz & Category) | null> {
    try {
      return (await this.sendData('getQuiz', id_quiz))[0];
    } catch (error) {
      console.error('Error getting quiz:', error);
      return null;
    }
  }
  public async insertReport(id_user : number, type : ReportType, description : string) : Promise<boolean> {
    try {
      const result : any = await this.sendData('insertReport', { id_user, type, description });
      return !!result.affectedRows;
    } catch (error) {
      console.error('Error inserting report:', error);
      return false;
    }
  }
  public async checkLogin(username : string, password : string) : Promise<boolean> {
    try {
      const result : any = await this.sendData('checkLogin', {username, password});
      return result[0].userExists;
    } catch (error) {
      console.error('Error checking login:', error);
      return false;
    }
  }
  public async insertUser(username : string, password : string, email : string) : Promise<boolean> {
    try {
      let date: Date = new Date();
      let date_sql : string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      const result : any = await this.sendData('insertUser', {username, password, email, date_sql});
      return !!result[result.length - 2].affectedRows;
    } catch (error) {
      console.error('Error inserting user:', error);
      return false;
    }
  }
  public async getQuizzesFromToday() : Promise<(Quiz & Category)[]> {
    try {
      return await this.sendData('getQuizzesFromToday', null);
    } catch (error) {
      console.error('Error getting quizzes from today:', error);
      return [];
    }
  }
  public async getQuizzesFromWeekend() : Promise<(Quiz & Category)[]> {
    try {
      return await this.sendData('getQuizzesFromWeekend', null);
    } catch (error) {
      console.error('Error getting quizzes from weekend:', error);
      return [];
    }
  }
  public async getUserData(username : string) : Promise<(User & any)> {
    try {
      return (await this.sendData('getUser', username))[0];
    } catch (error) {
      console.error('Error getUserData:', error);
      return [];
    }
  }
}
