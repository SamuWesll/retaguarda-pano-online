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
    { title: 'Produtos', fragment: '/produtos', img: '../../../assets/img/trolley.png' },
    { title: 'Clientes', fragment: '/clientes', img: '../../../assets/img/person.png'  },
    { title: 'Pedidos', fragment: '/pedidos', img: '../../../assets/img/box.png'  }
  ]

  constructor(public route: ActivatedRoute) {  }

  ngOnInit(): void {
  }

}
