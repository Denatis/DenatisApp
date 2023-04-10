import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';
import { User } from '../../services/authentication/user.model';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loading = false;
  formData: User = {
    idUser: 0,
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.loading = true;

    const result = await this.authService.logIn(this.formData);
    if (!result.isOk) {
      this.loading = false;
      notify(result.message, 'error', 2000);
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
