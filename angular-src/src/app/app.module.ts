import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ParticlesModule } from 'angular-particle';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AceEditorModule } from 'ng2-ace-editor';
import { CountdownTimerModule } from 'ngx-countdown-timer';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChalsComponent } from './chals/chals.component';
import { RulesComponent } from './rules/rules.component';
import { RankingComponent } from './ranking/ranking.component';
import { ProfileComponent } from './profile/profile.component';
import { AddChalComponent } from './add-chal/add-chal.component';
import { QuestionComponent } from './question/question.component';
import { AddQueComponent } from './add-que/add-que.component';
import { AddFlawComponent } from './add-flaw/add-flaw.component';
import { FlawComponent } from './flaw/flaw.component';
import { EditorComponent } from './editor/editor.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';

import { AuthService } from './services/auth.service';
import { ChalService } from './services/chal.service';
import { DataService } from './services/data.service';
import { QuesService } from './services/ques.service';
import { FlawService } from './services/flaw.service';
import { CookieActionsService } from './services/cookieActions.service';
import { LocalStorageService } from './services/localStorage.service';


import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AddContestComponent } from './add-contest/add-contest.component';
import { ContestsComponent } from './contests/contests.component';
import { ContestService } from './services/contest.service';
import { ContestRankingsComponent } from './contest-rankings/contest-rankings.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chals', component: ChalsComponent, canActivate: [AuthGuard] },
  { path: 'ques/contests/:cid', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'flaw', component: FlawComponent, canActivate: [AuthGuard] },
  { path: 'rules', component: RulesComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [AdminAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'chals/add', component: AddChalComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'ques/add/:cid', component: AddQueComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'flaws/add', component: AddFlawComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'welcome', component: WelcomepageComponent, canActivate: [AuthGuard] },
  { path: 'editor/:qCode', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'contests/add', component: AddContestComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'contests', component: ContestsComponent, canActivate: [AuthGuard] },
  { path: 'contests/ranking/:cid', component: ContestRankingsComponent, canActivate: [AuthGuard] },

];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ChalsComponent,
    RulesComponent,
    RankingComponent,
    ProfileComponent,
    AddChalComponent,
    QuestionComponent,
    AddQueComponent,
    AddFlawComponent,
    FlawComponent,
    EditorComponent,
    WelcomepageComponent,
    AddContestComponent,
    ContestsComponent,
    ContestRankingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ParticlesModule,
    AceEditorModule,
    SimpleNotificationsModule.forRoot(),
    CountdownTimerModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [
    AuthService,
    ChalService,
    DataService,
    QuesService,
    FlawService,
    ContestService,
    AuthGuard,
    AdminAuthGuard,
    CookieService,
    CookieActionsService,
    LocalStorageService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
