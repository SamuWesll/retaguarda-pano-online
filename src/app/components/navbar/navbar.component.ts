import { Component, OnInit, Output } from '@angular/core';
import { NgbModule, NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  links = [
    { id:1, title: 'Dashboard', fragment: 'dashboard', imgCheck: '../../../assets/img/dashboard_check.png', img: '../../../assets/img/dashboard.png', selected:true},
    { id:2, title: 'Produtos', fragment: 'produtos', imgCheck:"../../../assets/img/inventory_check.png", img: '../../../assets/img/trolley.png', selected:false },
    { id:3, title: 'Clientes', fragment: 'clientes', imgCheck: '../../../assets/img/person_check.png', img: '../../../assets/img/person.png', selected:false },
    { id:4, title: 'Pedidos', fragment: 'pedidos', imgCheck: '../../../assets/img/box_check.png', img: '../../../assets/img/box.png', selected:false }
  ];

  navbarAjustado: boolean = true

  constructor(public route: ActivatedRoute) {  }

  isCheck(id: number) {
    for(let i = 0; i <= this.links.length; i++) {
      if(this.links[i].id == id) {
        this.links[i].selected = true;
      } else {
        this.links[i].selected = false;
      }
    }
  }

  ajustarNavbar() {
    if(this.navbarAjustado) {
      this.navbarAjustado = false;
      return console.log(this.navbarAjustado)
    }
    this.navbarAjustado = true;
    return console.log(this.navbarAjustado)
  }

  ngOnInit(): void {
  }

}
