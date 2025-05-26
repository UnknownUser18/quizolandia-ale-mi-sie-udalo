import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { DatabaseService, WebSocketStatus, checkUser } from '../../database.service';
import { Title } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransitionService } from '../../transition.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  imports: [
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  protected nationalities: string[] = [
    "Afganistan", "Albania", "Algieria", "Andora", "Angola", "Antigua i Barbuda", "Argentyna", "Armenia", "Australia", "Austria", "Azerbejdżan", "Bahamy", "Bahrajn", "Bangladesz", "Barbados", "Białoruś", "Belgia", "Belize", "Benin", "Bhutan", "Boliwia", "Bośnia i Hercegowina", "Botswana", "Brazylia", "Brunei", "Bułgaria", "Burkina Faso", "Burundi", "Wyspy Zielonego Przylądka", "Kambodża",
    "Kamerun", "Kanada", "Republika Środkowoafrykańska", "Czad", "Chile", "Chiny", "Kolumbia", "Komory", "Kongo (Republika Konga)", "Kostaryka", "Chorwacja", "Kuba", "Cypr", "Czechy",
    "Demokratyczna Republika Konga", "Dania", "Dżibuti", "Dominika", "Republika Dominikańska", "Ekwador", "Egipt", "Salwador", "Gwinea Równikowa", "Erytrea", "Estonia", "Eswatini (dawniej Suazi)", "Etiopia", "Fidżi", "Finlandia", "Francja", "Gabon", "Gambia", "Gruzja", "Niemcy", "Ghana", "Grecja", "Grenada", "Gwatemala", "Gwinea", "Gwinea Bissau", "Gujana", "Haiti", "Honduras", "Węgry",
    "Islandia", "Indie", "Indonezja", "Iran", "Irak", "Irlandia", "Izrael", "Włochy", "Jamajka", "Japonia", "Jordania", "Kazachstan", "Kenia", "Kiribati", "Kuwejt", "Kirgistan", "Laos", "Łotwa", "Liban", "Lesotho", "Liberia", "Libia",
    "Liechtenstein", "Litwa", "Luksemburg", "Madagaskar", "Malawi", "Malezja", "Malediwy", "Mali", "Malta", "Wyspy Marshalla", "Mauretania", "Mauritius", "Meksyk", "Mikronezja", "Mołdawia", "Monako",
    "Mongolia", "Czarnogóra", "Maroko", "Mozambik", "Mjanma (Birma)", "Namibia", "Nauru", "Nepal", "Holandia", "Nowa Zelandia", "Nikaragua", "Niger", "Nigeria", "Korea Północna", "Macedonia Północna", "Norwegia", "Oman", "Pakistan", "Palau", "Palestyna", "Panama", "Papua-Nowa Gwinea", "Paragwaj", "Peru", "Filipiny", "Polska", "Portugalia", "Katar", "Rumunia", "Rosja", "Rwanda",
    "Saint Kitts i Nevis", "Saint Lucia", "Saint Vincent i Grenadyny", "Samoa", "San Marino", "São Tomé i Príncipe", "Arabia Saudyjska", "Senegal", "Serbia", "Seszele", "Sierra Leone", "Singapur", "Słowacja", "Słowenia",
    "Wyspy Salomona", "Somalia", "Republika Południowej Afryki", "Korea Południowa", "Sudan Południowy", "Hiszpania", "Sri Lanka", "Sudan", "Surinam", "Szwecja", "Szwajcaria", "Syria", "Tadżykistan", "Tanzania", "Tajlandia", "Timor Wschodni", "Togo", "Tonga", "Trynidad i Tobago", "Tunezja", "Turcja", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraina", "Zjednoczone Emiraty Arabskie", "Wielka Brytania", "Stany Zjednoczone Ameryki", "Urugwaj", "Uzbekistan", "Vanuatu", "Watykan", "Wenezuela", "Wietnam", "Jemen", "Zambia", "Zimbabwe"
  ];
  protected showWarning: boolean = false;
  protected showPanel: boolean = false;
  protected forms = {
    id_user : 0,
    avatar: '',
    username: '',
    password: '',
    password_repeat: '',
    email: '',
    nationality: typeof this.nationalities[0] === 'string' ? this.nationalities[0] : '',
  }

  @ViewChild('panel') panel!: ElementRef;

  constructor(
    private database : DatabaseService,
    private localStorage : LocalStorageService,
    private title: Title,
    private transition : TransitionService,
    private cdr : ChangeDetectorRef,
    private zone : NgZone,
    private router: Router
  ) {
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;
      checkUser(this.database).then((r) => {
        if (!r) return;
        this.title.setTitle(`Edycja użytkownika - ${this.localStorage.get('username')} | Quizolandia`);
        this.database.send('getUserID', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'empty').then(() => {
          this.forms.id_user = this.database.get_variable('empty')[0].id_user;
          this.database.send('getUserEditData', { id_user: this.forms.id_user }, 'user').then(() => {
            let data = this.database.get_variable('user')[0];
            this.forms = {
              ...this.forms,
              avatar: data.avatar,
              username: data.username,
              email: data.email,
              password: data.password,
              password_repeat: data.password,
              nationality: data.nationality,
            }
          });
        });
      });
    });
  }

  protected saveProfile() : void {
    if (this.forms.password !== this.forms.password_repeat) {
      this.showPanel = true;
      this.cdr.detectChanges();
      this.transition.animateWithTransitions(true, this.zone, this.panel.nativeElement).then();
      return;
    }
    this.database.send('updateUser', { username: this.forms.username, email: this.forms.email, password: this.forms.password, nationality: this.forms.nationality, avatar: this.forms.avatar, id_user: this.forms.id_user }, 'empty').then(() => {
      if(this.database.get_variable('empty').affectedRows === 1) {
        this.showPanel = true;
        this.cdr.detectChanges();
        this.transition.animateWithTransitions(true, this.zone, this.panel.nativeElement).then();
      }
    })
  }

  protected closePanel() : void {
    this.transition.animateWithTransitions(false, this.zone, this.panel.nativeElement).then(() => {
      this.showPanel = false;
      if (this.forms.password === this.forms.password_repeat) {
        this.router.navigate(['/profile']).then()
      }
    });
  }
}
