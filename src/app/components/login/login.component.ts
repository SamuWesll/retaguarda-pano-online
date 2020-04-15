import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() receberLogin;
  @Output() alterarLogin = new EventEmitter();

  loginInput = new FormControl();
  senhaInput = new FormControl();

  constructor() { }

  ngOnInit(): void {
    console.log(this.receberLogin);
  }

  realizandoLogin(login, senha) {
    this.alterarLogin.emit({logado: true, user: login, senha: senha});
  }
}