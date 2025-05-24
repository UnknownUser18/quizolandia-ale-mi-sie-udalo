import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SearchResultsComponent } from './search-results/search-results.component';
import { QuizPageComponent } from './quizy/quiz-page/quiz-page.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login-page/login/login.component';
import { RegisterComponent } from './login-page/register/register.component';
import { UserPageComponent } from './user/user-page/user-page.component';
import { QuizSolveComponent } from './quizy/quiz-solve/quiz-solve.component';
import { HomeComponent } from './home/home.component';

export const routes : Routes = [
  { path: '', component: HomeComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'quiz/:id', component: QuizPageComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'quiz/:id/solve', component: QuizSolveComponent },
  { path: 'user/:id', component: UserPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect to home for any unknown routes
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
