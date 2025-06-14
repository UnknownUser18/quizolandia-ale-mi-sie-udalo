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
import { QuizResultsComponent } from './quizy/quiz-results/quiz-results.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { RankingComponent } from './ranking/ranking.component';
import { DziedzinyComponent } from './dziedziny/dziedziny.component';
import { QuizCreateComponent } from './quizy/quiz-create/quiz-create.component';

export const routes : Routes = [
  { path: '', component: HomeComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'quiz/:id', component: QuizPageComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent },
  { path: 'dziedziny', component: DziedzinyComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'leaderboard', component: RankingComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'profile/edit', component: UserEditComponent },
  { path: 'user/:id', component: UserPageComponent },
  { path: 'quiz/:id/solve', component: QuizSolveComponent },
  { path: 'quiz/:id/result', component: QuizResultsComponent },
  { path: 'user/:id', component: UserPageComponent },
  { path: 'create-quiz', component: QuizCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect to home for any unknown routes
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

