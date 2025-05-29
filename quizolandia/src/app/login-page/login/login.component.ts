import { Component, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../database.service';
import { TransitionService } from '../../transition.service';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '../../local-storage.service';
@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        RouterLink,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected username: string = '';
  protected password: string = '';
  protected showPanel: boolean = false;
  protected errorMessage: string = '';

  @ViewChild('panel') panel!: ElementRef

  constructor(
    private router : Router,
    private database : DatabaseService,
    private transition : TransitionService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private localStorage : LocalStorageService
  ) {}

  private async transitionHandler(open : boolean, errorMessage : string) : Promise<void> {
    this.showPanel = open;
    this.cdr.detectChanges();
    this.errorMessage = errorMessage;
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.transition.animateWithTransitions(open, this.zone, this.panel.nativeElement).then();
    });
  }
  protected login() : void {
    if(this.username === '' || this.password === '') {
      this.transitionHandler(true, 'Nazwa użytkownika / email oraz hasło musi zostać wypełnione.').then();
      return;
    }
    this.database.send('checkLogin', { username: this.username, password: this.password }, 'success').then(() : void => {
      const result = this.database.get_variable('success')![0].userExists;
      if (result) {
        this.localStorage.set('username', this.username);
        this.localStorage.set('password', this.password);
        const date = new Date();
        const date_sql = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        this.database.send('updateLastLogin', { lastlogin: date_sql, username: this.username, password: this.password }, 'empty').then(() : void => {
          this.router.navigate(['']).then();
        });
      } else {
        this.transitionHandler(true, 'Nieprawidłowa nazwa użytkownika lub hasło.').then();
      }
    });
  }

  protected closePanel() : void {
    this.transition.animateWithTransitions(false, this.zone, this.panel.nativeElement).then(() => {
      this.showPanel = false;
      this.errorMessage = '';
    });
  }
}
