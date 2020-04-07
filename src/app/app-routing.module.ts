import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ClientesComponent } from './components/clientes/clientes.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/admin",
    pathMatch: "full"
  },
  {
    path: "produtos",
    component: ProdutosComponent
  },
  {
    path: "clientes",
    component: ClientesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
