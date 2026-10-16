import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink],
  styleUrl: '../styles/login.css',
  template: `
    <main class="login-page">
      <section class="login-visual" aria-hidden="true">
        <div class="visual-content">
          <div class="visual-logo"><mat-icon>inventory_2</mat-icon></div>
          <p class="eyebrow">Campus matériel</p>
          <h1>Votre matériel, simplement.</h1>
          <p>Retrouvez vos réservations et gérez votre matériel depuis un seul espace.</p>
        </div>
        <div class="visual-orbit orbit-one"><mat-icon>laptop_mac</mat-icon></div>
        <div class="visual-orbit orbit-two"><mat-icon>videocam</mat-icon></div>
        <div class="visual-orbit orbit-three"><mat-icon>mic</mat-icon></div>
      </section>

      <section class="login-panel">
        <a class="back-link" mat-button routerLink="/">
          <mat-icon aria-hidden="true">arrow_back</mat-icon>
          Retour à l'accueil
        </a>
        <div class="login-heading">
          <p class="eyebrow">Espace personnel</p>
          <h2>Bon retour parmi nous</h2>
          <p>Connectez-vous pour accéder à vos réservations.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="login()" novalidate>
          <label>
            Adresse e-mail
            <div class="input-wrapper">
              <mat-icon aria-hidden="true">mail</mat-icon>
              <input type="email" formControlName="email" autocomplete="email" placeholder="vous@exemple.com" />
            </div>
          </label>
          @if (email.invalid && email.touched) {
            <p class="field-error" role="alert">Saisissez une adresse e-mail valide.</p>
          }

          <label>
            Mot de passe
            <div class="input-wrapper">
              <mat-icon aria-hidden="true">lock</mat-icon>
              <input type="password" formControlName="password" autocomplete="current-password" placeholder="Votre mot de passe" />
            </div>
          </label>
          @if (password.invalid && password.touched) {
            <p class="field-error" role="alert">Le mot de passe est obligatoire.</p>
          }

          @if (error) {
            <div class="login-error" role="alert">
              <mat-icon aria-hidden="true">error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>
          }

          <button class="submit-button" mat-flat-button type="submit" [disabled]="loginForm.invalid">
            Se connecter
            <mat-icon aria-hidden="true">arrow_forward</mat-icon>
          </button>
        </form>
      </section>
    </main>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected error = '';

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    if (!this.auth.login(email, password)) {
      this.error = 'E-mail ou mot de passe incorrect.';
      return;
    }
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/catalogue';
    this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/catalogue');
  }

  protected get email() {
    return this.loginForm.controls.email;
  }

  protected get password() {
    return this.loginForm.controls.password;
  }
}
