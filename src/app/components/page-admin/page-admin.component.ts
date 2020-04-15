import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-admin',
  templateUrl: './page-admin.component.html',
  styleUrls: ['./page-admin.component.css']
})
export class PageAdminComponent implements OnInit {

  login = {
    logado: false
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  reciverRealizandoLogin(alterarLogin) {
    // this.login = alterarLogin;
    if(alterarLogin.user == "admin" &&  alterarLogin.senha == "admin") {
      this.login.logado = true;
    } else {
      alert("Login e senha invalida")
    }
    
  }

}
