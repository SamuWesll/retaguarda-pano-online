import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  links = [
    { title: 'Produtos', fragment: 'produtos' },
    { title: 'Clientes', fragment: 'clientes' }
  ]

  constructor(public route: ActivatedRoute) {  }

  ngOnInit(): void {
  }

}
