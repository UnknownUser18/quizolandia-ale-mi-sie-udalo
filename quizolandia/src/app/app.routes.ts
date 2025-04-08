import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { QuizPageComponent } from './quizy/quiz-page/quiz-page.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login-page/login/login.component';
import { RegisterComponent } from './login-page/register/register.component';
import { UserPageComponent } from './user/user-page/user-page.component';

export const routes : Routes = [
  { path: '', component: AppComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'quiz/:id', component: QuizPageComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserPageComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
