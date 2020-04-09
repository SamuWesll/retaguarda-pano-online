import { Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { ProdutosService } from 'src/app/services/produtos.service';
import { Produtos } from 'src/app/models/Produtos';
import { FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/Categoria';

let listaProdutos: Produtos[] = [];

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;

  // atributos do formulario
  tituloInput = new FormControl();
  categoriaSelect = new FormControl();
  valorInput = new FormControl();
  valorDescInput = new FormControl();
  imagem: string = "";
  descricaoInput = new FormControl();
  novaCagoriaInput = new FormControl();

  produtoSelecionado: Produtos;

  listaProdutos: Produtos[] = [];
  listaCategoria: Categoria[] = [];

  paginas: any[] = [];
  pageSelect = {
    inicio: 0,
    fim: 14,
  }

  constructor(public produtoHttp: ProdutosService, public categoriaHttp: CategoriaService) {
    
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

  editar(produto) {
    // console.log(produto)
    this.produtoSelecionado = produto;
    this.tituloInput.setValue(produto.tituloProduto);
    this.categoriaSelect.setValue(produto.categoria);
    this.valorInput.setValue(produto.valor);
    this.valorDescInput.setValue(produto.valorDesconto);
    this.imagem = produto.imagem;
    this.descricaoInput.setValue(produto.descricao)
  }

  novoProduo() {
    this.produtoSelecionado = "";
    this.tituloInput.setValue("");
    this.categoriaSelect.setValue('');
    this.valorInput.setValue('');
    this.valorDescInput.setValue('');
    this.imagem = '';
    this.descricaoInput.setValue('')
  }

  mascaraValor(valor: number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  getNomeDaCategoria(id: number) {
    let nomeCategoria = "";
    for(let i = 0; i < this.listaCategoria.length; i++) {
      if(this.listaCategoria[i]['idCategoria'] == id) {
        nomeCategoria = this.listaCategoria[i]['descricao']
      }
    }
    return nomeCategoria
  }

  getCategoria() {
    this.categoriaHttp.getLista().subscribe(
      (categorias) => {
        for(let i = 0; i< categorias['length']; i++) {
          this.listaCategoria.push(categorias[i]);
        }
      }
    )
  }

  getProdutosLista() {
    this.produtoHttp.getLista().subscribe(
      (data) => {
        for(let i = 0; i < data['length']; i++) {
          this.listaProdutos.push(data[i])
        }
        let qtdPaginas = Math.round((this.listaProdutos.length / 15));
        console.log(qtdPaginas)
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
      }
    )
  }

  putProduto(prod: Produtos, titulo: string, categoria: number, valor: number, valorDesc: number, descricao: string) {
    if(titulo == prod['tituloProduto'] && categoria == prod['categoria'] && valor == prod['valor'] && valorDesc == prod['valorDesconto'] && descricao == prod['descricao']) {
      return alert ("Nenhum campo alterado!")
    };
    
    prod['tituloProduto'] = titulo;
    prod['descricao'] = descricao;
    prod['valor'] = valor;
    prod['valorDesconto'] = valorDesc;
    prod['categoria'] = categoria;

    console.log(prod)
    this.produtoHttp.putProduto(prod).subscribe(
      (data) => {
        console.log(data)
      }
    )
  };

  createProduto(titulo: string, categoria: number, valor: number, valorDesc: number, descricao: string) {
    // let novoProduto: Produtos = new Produtos(1,titulo,descricao,"",valor,valorDesc,categoria);
    let novoProduto = {
      categoria: categoria,
      descricao: descricao,
      imagem: "",
      tituloProduto: titulo,
      valor: valor,
      valorDesconto: valorDesc,
    };
    this.produtoHttp.createProduto(novoProduto).subscribe(
      data => {
        console.log(data);
      }
    )
  }

  ngOnInit(): void {

    this.getCategoria();

    this.getProdutosLista();

  }

}
