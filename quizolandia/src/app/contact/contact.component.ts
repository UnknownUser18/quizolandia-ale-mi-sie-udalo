import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {checkUser, DatabaseService, ReportType, WebSocketStatus} from '../database.service';
import { TransitionService } from '../transition.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
    selector: 'app-contact',
    imports: [
        FormsModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
  protected report_problem : string = '';
  protected description: string = '';
  protected result : boolean = false;
  protected sentReport : boolean = false;
  protected isLoggedIn : boolean = false;
  @ViewChild('panel') panel! : ElementRef

  constructor(
    private title: Title,
    private database: DatabaseService,
    private zone : NgZone,
    private transition : TransitionService,
    private cdr : ChangeDetectorRef,
    private localStorage : LocalStorageService) {
    this.title.setTitle('Kontakt - Quizolandia');
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;
      this.localStorage.isLoggedin.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.cdr.detectChanges();
      });
      checkUser(this.database).then((r : boolean) : void => {
        this.localStorage.isLoggedin.next(r);
      });
    });
  }

  protected async sendReport() : Promise<void> {
    if (Object.values(ReportType).indexOf(this.report_problem as ReportType) === -1) {
      throw new Error('Invalid report type');
    } else if(this.description.trim() === '') {
      throw new Error('Description cannot be empty');
    }
    let isLogged = await checkUser(this.database);
    if (!isLogged)
      throw new Error('You must be logged in to send a report');
    await this.database.send('getUserID', { username: this.localStorage.get('username'), password: this.localStorage.get('password')}, 'empty');
    const userId = this.database.get_variable('empty')[0].id_user;
    this.database.send('insertReport', {id_user: userId, type : this.report_problem, description: this.description}, 'empty').then(r => {
      this.sentReport = true;
      this.result = r;
      this.cdr.detectChanges();
      this.transition.animateWithTransitions(true, this.zone, this.panel.nativeElement).then();
    });
  }

  protected closePanel() : void {
    this.transition.animateWithTransitions(false, this.zone, this.panel.nativeElement).then(() => {
      this.sentReport = false;
      this.report_problem = '';
      this.description = '';
      this.result = false;
      this.cdr.detectChanges();
    });
  }

  protected readonly ReportType = ReportType;
}
