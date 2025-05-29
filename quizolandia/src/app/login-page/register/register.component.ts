import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../../database.service';
import { TransitionService } from '../../transition.service';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: '../login-page.scss'
})
export class RegisterComponent {
  protected forms = {
    username: '',
    password: '',
    email: '',
    password_repeat: ''
  };
  protected showPanel : boolean = false;
  protected errorMessage: string = '';
  @ViewChild('panel') panel!: ElementRef;

  constructor(
    private database : DatabaseService,
    private router : Router,
    private transition : TransitionService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  private async transitionHandler(open : boolean, errorMessage : string) : Promise<void> {
    this.showPanel = open;
    this.cdr.detectChanges();
    this.errorMessage = errorMessage;
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.transition.animateWithTransitions(open, this.zone, this.panel.nativeElement).then();
    });
  }
  protected register() : void {
    this.forms.username = this.forms.username.trim();
    this.forms.password = this.forms.password.trim();
    this.forms.email = this.forms.email.trim();
    this.forms.password_repeat = this.forms.password_repeat.trim();
    if(this.forms.username === '' || this.forms.email === '' || this.forms.password === '' || this.forms.password_repeat === '') {
      this.transitionHandler(true, 'Każde pole musi zostać wypełnione.').then();
      return;
    }
    if(this.forms.password.length < 6) {
      this.transitionHandler(true, 'Hasło musi mieć przynajmniej 7 znaków.').then();
      return;
    }
    if(this.forms.password !== this.forms.password_repeat) {
      this.transitionHandler(true, 'Hasła się nie zgadzają.').then();
      return;
    }
    if(this.forms.username.length < 3) {
      this.transitionHandler(true, 'Nazwa użytkownika musi mieć przynajmniej 4 znaki.').then();
      return;
    }
    if(!this.forms.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.transitionHandler(true, 'Email nie jest prawidłowy.').then();
      return;
    }
    let date: Date = new Date();
    let date_sql : string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    this.database.send('insertUser', {email : this.forms.email, username : this.forms.username, password : this.forms.password, accDate : date_sql}, 'success').then(() : void => {
      const result = this.database.get_variable('success')![0];
      if(result.affectedRows) {
        this.router.navigate(['/login']).then();
      } else {
        this.transitionHandler(true, 'Nazwa użytkownika lub email jest już zajęty.').then();
      }
    })
  }

  protected closePanel() : void {
    this.transition.animateWithTransitions(false, this.zone, this.panel.nativeElement).then(() => {
      this.showPanel = false;
      this.errorMessage = '';
    });
  }
}
