import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HlmDialogComponent } from '@spartan-ng/ui-dialog-helm';
import { CategoriesService } from '../categories/services/categories.service';
import CurrencyEnum from '../../../shared/account-currency';
import Category from '../categories/components/category-list/category.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  loginMode = true;
  currencies = Object.values(CurrencyEnum);
  categories: Category[] = [];
  selectedCategories: any[] = [];
  totalBudgetedAmount: number = 2000;
  cashAccountName: string = '';
  cashAccountCurrency: CurrencyEnum = CurrencyEnum.RON;
  cashAccountBalance: number = 1000;
  registerError: string | null = null;
  selectedCategoriesError: string | null = null;
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  @ViewChild('categoryDialog') categoryDialog!: HlmDialogComponent;
  @ViewChild('accountDialog') accountDialog!: HlmDialogComponent;

  constructor(
    private authService: AuthService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getDefaultCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(authForm: NgForm) {
    if (this.loginMode) {
      const { email, password } = authForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert(
            error.error.message || 'An error occurred. Please try again later.'
          );
        },
      });
    } else {
      const { username, email, password, confirmPassword } = authForm.value;
      this.authService
        .register(username, email, password, confirmPassword)
        .subscribe({
          next: (response) => {
            this.username = username;
            this.email = email;
            this.password = password;
            this.confirmPassword = confirmPassword;
            this.openCategoryDialog();
          },
          error: (error) => {
            console.error('Registration failed', error);
            alert(
              error.error.message ||
                'An error occurred. Please try again later.'
            );
          },
        });
    }
  }

  openCategoryDialog() {
    this.categoryDialog.open();
  }

  openAccountDialog(ctx: any) {
    if (this.selectedCategories.length === 0) {
      this.selectedCategoriesError = 'Please select at least one category';
      return;
    }
    ctx.close();
    this.accountDialog.open();
  }

  updateSelectedCategories(category: Category) {
    if (category.isSelected) {
      this.selectedCategories.push(category._id);
    } else {
      const index = this.selectedCategories.indexOf(category._id);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  completeRegistration(ctx: any) {
    console.log(this.selectedCategories);
    const userCompletionData = {
      selectedCategories: this.selectedCategories,
      totalBudgetedAmount: this.totalBudgetedAmount,
      cashAccountName: this.cashAccountName,
      cashAccountCurrency: this.cashAccountCurrency,
      cashAccountBalance: this.cashAccountBalance,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.authService.completeRegistration(userCompletionData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        ctx.close();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Completion failed', error);
        this.registerError = 'Completion failed. Please try again.';
      },
    });
  }
}
