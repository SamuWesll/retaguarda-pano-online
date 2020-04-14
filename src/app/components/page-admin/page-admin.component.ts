import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-admin',
  templateUrl: './page-admin.component.html',
  styleUrls: ['./page-admin.component.css']
})
export class PageAdminComponent implements OnInit {

  login = {
    logado: true
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  reciverRealizandoLogin(alterarLogin) {
    this.login = alterarLogin;
    console.log('Login do filho', alterarLogin);
  }

}
