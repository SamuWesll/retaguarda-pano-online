import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateParserFormatter, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { PedidosService } from 'src/app/services/pedidos.service';
import { formatDate } from '@angular/common';
import { ClienteService } from 'src/app/services/cliente.service';
import { EnderecoService } from 'src/app/services/endereco.service';
import { ProdutosService } from 'src/app/services/produtos.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  faCalendar = faCalendar;

  listaPedidos: any = [];
  listaTodosPedidos: any = [];
  cliente = {};
  endereco;

  // status
  status = [
    {
      ds_status: "Aguardando confirmação de pagamento",
      quantidade: 0,
      acao: "Processar pedido",
    },
    {
      ds_status: "Pagamento confirmado",
      quantidade: 0,
      acao: "Processar pedido",
    },
    {
      ds_status: "Cancelado",
      quantidade: 0,
      acao: "x",
    },
    {
      ds_status: "Produto em separação",
      quantidade: 0,
      acao: "Faturar",
    },
    {
      ds_status: "Produto enviado",
      quantidade: 0,
      acao: "Em trânsito",
    },
    {
      ds_status: "Produto entregue",
      quantidade: 0,
      acao: "finalizado",
    },
  ];

  pedidoSelecionado: object = {
    selecionado: false,
    pedido: [] = [],
  };

  listaCategoria = [];

  paginas: any[] = [];
  pageSelect = {
    inicio: 0,
    fim: 14,
  }

  constructor(
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter, 
    private pedidoService: PedidosService, 
    private clienteService: ClienteService, 
    private enderecoService: EnderecoService,
    private produtoService: ProdutosService,
    private categoriaService: CategoriaService,
    ) 
      {
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -10);
        this.toDate = calendar.getToday();
      }

  // Inicio dos metodos do calendario
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate))
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate))
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  // Fim dos metodos do calendario

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

  pesquisar(texto: string) {
    let pedidoArray = [];

    this.listaTodosPedidos.forEach(ped => {
      let idString = ped.idPedido + "";
      if(idString.toLowerCase().includes(texto.toLowerCase()) || ped.status.toLowerCase().includes(texto.toLowerCase())) {
        pedidoArray.push(ped)
      }
    });

    this.listaPedidos = pedidoArray;
  }

  dataString(date: NgbDate): string {

    function menorZero(n) {
      if(n < 10) {
        return "0" + n;
      }
      return n + "";
    };

    let ano = date.year + "";
    let mes = menorZero(date.month);
    let dia = menorZero(date.day);
    
    return ano + "-" + mes + "-" + dia;
  }

  getPedidoPeriodo(inicio: string, fim: string) {

    this.pedidoService.getPedidosPeriodo(inicio, fim).subscribe(
      data => {
        if(data[0].idPedido) {
          this.listaPedidos = data;
          this.listaTodosPedidos = data;
        }
      },
      ERROR => {
        if(ERROR['error'] == "Não existem pedidos cadastrados nesse período") {
          this.listaPedidos = [];
          return alert(ERROR['error'])
        }
      }
    )
  }

  formatarData(data) {
    return data = formatDate(data, 'dd-MM-yyyy', 'en-BR')
  }

  acaoStatus(status) {
    let acao
    this.status.forEach(st => {
      if(st.ds_status == status) {
        return acao = st.acao;
      };
      return
    })
    return acao;
  }

  mascaraValor(valor: number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  selecionandoPedido(pedido) {
    this.pedidoSelecionado['pedido'] = [];
    this.pedidoSelecionado['selecionado'] = true;
    this.pedidoSelecionado['pedido'].push(pedido);
    this.endereco = {};
    this.clienteService.getClienteId(this.pedidoSelecionado['pedido'][0].tbClienteIdCliente).subscribe(
      data => {
        let body = {
          cpf: data.cpf,
          dataNascimento: data.dataNascimento,
          email: data.email,
          genero: data.genero,
          idCliente: data.idCliente,
          nome: data.nome,
          numTelefoneCelular: data.numTelefoneCelular,
          numTelefoneFixo: data.numTelefoneFixo,
        }
        this.cliente = body;
        this.capturaEndereco();
        this.detalheProduto();
        // console.log(pedido);
        // console.log(this.pedidoSelecionado['pedido']);
      }
    )
    
  }

  calcularIdade(data) {
    let dataAtual = this.calendar.getToday();
    let idade;

    let anoNasc = parseInt(formatDate(data, 'yyyy', 'en-BR'));
    let mesNasc = parseInt(formatDate(data, 'MM', 'en-BR'));
    let diaNasc = parseInt(formatDate(data, 'dd', 'en-BR'));

    if(mesNasc <= dataAtual.month || mesNasc <= dataAtual.month && diaNasc <= dataAtual.day) {
      return idade = dataAtual.year - anoNasc;
    } else {
      return idade = dataAtual.year - anoNasc - 1;
    }    
    
  }

  capturaEndereco() {
    if(this.pedidoSelecionado['pedido'][0].tbEnderecoIdEndereco == null) {
      return;
    } else {
      this.enderecoService.getEnderecoId(this.pedidoSelecionado['pedido'][0].tbEnderecoIdEndereco).subscribe(
        end => {
          this.endereco = end;
        }
      )
    }
  }

  detalheProduto() {
    // console.log(this.pedidoSelecionado['pedido'][0].itensPedido)
    let produtoDetalhado = [];
    this.pedidoSelecionado['pedido'][0].itensPedido.forEach((item, i) => {
      let retornoAPI = {}
      this.produtoService.getId(item.produto).subscribe(
        data => {
          // console.log(data);
          // produtoDetalhado.push(data)
          let body = {
            idItensPedido: item.idItensPedido,
            pedido: item.pedido,
            produto: item.produto,
            qtdProduto: item.qtdProduto,
            valorProduto: item.valorProduto,
            descricao: data.descricao,
            imagem: data.imagem,
            tituloProduto: data.tituloProduto,
            categoria: data.categoria,
          }
          this.pedidoSelecionado['pedido'][0].itensPedido[i] = body;
        }
      )
      
      // console.log(this.pedidoSelecionado['pedido'][0].itensPedido)
    })
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
    this.categoriaService.getLista().subscribe(
      categoria => {
        for(let i = 0; i< categoria['length']; i++) {
          this.listaCategoria.push(categoria[i]);
        }
      }
    )
  }

  btnStatus() {
    alert("funcionou")
  }

  putStatus(status: string) {
    this.pedidoSelecionado['pedido'][0].status = status;
    // console.log(this.pedidoSelecionado['pedido'][0])

    this.pedidoService.putPedidoStatus(this.pedidoSelecionado['pedido'][0]).subscribe(
      pedidoAlterado => {
        console.log(pedidoAlterado);
      }
    )

    this.modal.hide();
  }

  ngOnInit(): void {
    this.getPedidoPeriodo(this.dataString(this.fromDate), this.dataString(this.toDate));
    this.getCategoria();
  }

}
