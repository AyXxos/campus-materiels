import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Connexion</h1>
    <form [formGroup]="loginForm" (ngSubmit)="login()">
      <label>
        E-mail
        <input type="email" formControlName="email" />
      </label>
      @if (email.invalid && email.touched) {
        <p role="alert">Saisissez une adresse e-mail valide.</p>
      }
      <label>
        Mot de passe
        <input type="password" formControlName="password" />
      </label>
      @if (password.invalid && password.touched) {
        <p role="alert">Le mot de passe est obligatoire.</p>
      }
      @if (error) { <p role="alert">{{ error }}</p> }
      <button type="submit" [disabled]="loginForm.invalid">Se connecter</button>
    </form>
    <p>Demo : admin@example.com / admin ou user@example.com / user</p>
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