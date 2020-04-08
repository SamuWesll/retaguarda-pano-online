import { Component, OnInit, PipeTransform } from '@angular/core';
import { ProdutosService } from 'src/app/services/produtos.service';
import { Produtos } from 'src/app/models/Produtos';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

let listaProdutos: Produtos[] = [];

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  listaProdutos: Produtos[] = [];
  paginas: any[] = [];
  pageSelect = {
    inicio: 15,
    fim: 30,
  }

  constructor(public produtoHttp: ProdutosService) {
    
  }

  selecionarPagina(page) {
    this.pageSelect.inicio = page['inicio'];
    this.pageSelect.fim = page['fim'];
    for(let i = 0; i < this.paginas.length; i++) {
      if(this.paginas[i].page == page.page) {
        this.paginas[i].selected = true;
      } else {
        this.paginas[i].selected = false;
      }
    }
  }

  pesquisa(text: string) {
    
  }

  mascaraValor(valor: number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  getProdutosLista() {
    this.produtoHttp.getLista().subscribe(
      (data) => {
        for(let i = 0; i < data['length']; i++) {
          this.listaProdutos.push(data[i])
        }
        let qtdPaginas = (this.listaProdutos.length / 15).toPrecision().length;
        let inicio = 0;
        let fim = 15;
        let select = true
        for(let i = 1; i <= qtdPaginas; i++) {
          let body = {
            page: i,
            inicio: inicio,
            fim: fim,
            selected: select,
          }
          this.paginas.push(body);
          inicio = fim;
          fim += 15
          select = false
        }
        console.log(this.listaProdutos);
        console.log(this.paginas);
      }
    )
  }

  ngOnInit(): void {

    this.getProdutosLista();

  }

}
