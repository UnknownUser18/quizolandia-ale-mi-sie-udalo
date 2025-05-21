import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatabaseService, ReportType } from '../database.service';

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
  constructor(private router : Router, private title: Title, private database: DatabaseService) {
    this.title.setTitle('Kontakt - Quizolandia');
  }

  protected sendReport() : void {
    if (!Object.keys(ReportType).includes(this.report_problem)) {
      throw new Error('Invalid report type');
    } else if(this.description.trim() === '') {
      throw new Error('Description cannot be empty');
    }
    this.database.send('insertReport', {id_user: 1, type : this.report_problem, description: this.description}, 'empty').then(r => {
      // TODO make a component for this
      if (r) {
        alert('Report sent successfully');
      } else {
        alert('Error sending report');
      }
    });
  }
}
