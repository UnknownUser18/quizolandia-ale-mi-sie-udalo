import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatabaseService, ReportType } from '../database.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private routerSubscription: Subscription | undefined;
  protected report_problem : string = '';
  protected description: string = '';
  constructor(protected router : Router, private title: Title, private database: DatabaseService) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) : void => {
      const urlSegments : string[] = event.url.split('/');
      if(!urlSegments.includes('contact')) return;
      this.title.setTitle('Kontakt - Quizolandia');
    });
  }

  sendReport() : void {
    if (!Object.keys(ReportType).includes(this.report_problem)) {
      throw new Error('Invalid report type');
    } else if(this.description.trim() === '') {
      throw new Error('Description cannot be empty');
    }
    this.database.insertReport(1, this.report_problem as unknown as ReportType, this.description).then(r => {
      r ? alert('Report sent successfully') : alert('Error sending report'); // TODO make a component for this
    });
  }
}
