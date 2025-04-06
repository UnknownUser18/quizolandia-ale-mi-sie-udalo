import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { QuizPageComponent } from './quizy/quiz-page/quiz-page.component';

export const routes : Routes = [
  { path: '', component: AppComponent },
  { path: 'search-results',component: SearchResultsComponent },
  { path: 'quiz/:id', component: QuizPageComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
