import { Component } from '@angular/core';
import { PessoaService } from './services/pessoa.service';
import { Pessoa } from './models/pessoa.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lista de pessoas';

  errorMessage = '';
  successMessage = '';
  
  pessoas$ = new Observable<Pessoa[]>();  

  //form
  form_id = '';
  form_nome_pessoa = '';
  form_email_principal = '';
  form_fone_res = '';

  constructor(private pessoaService: PessoaService){
    this.obterPessoasCadastradas();
  }

  //preencher grid com pessoas
  obterPessoasCadastradas(){
    this.pessoas$ = this.pessoaService.obterPessoas();
  }

  //preencher campos do formulário com uma determinada pessoa 
  //(ex: quando se clica em um registro de pessoa do grid)
  preencherCampos(pessoa: Pessoa){
    this.form_id = pessoa.id!.toString();
    this.form_nome_pessoa = pessoa.nome_pessoa;
    this.form_email_principal = pessoa.email_principal;
    this.form_fone_res = pessoa.fone_res;
  }
  
  //clique no botão
  buttonClick(){
    this.errorMessage = "";
    this.successMessage = "";

    if (!this.form_nome_pessoa || !this.form_email_principal)
      return;

    if (this.form_id) {
      this.atualizar();
      return;
    }
    else{
      this.cadastrar();
    }
  }

  //operação de cadastrar pessoa com dados do formulário ----------------------------------------------
  cadastrar(){
    this.pessoaService.cadastrarPessoa({ nome_pessoa: this.form_nome_pessoa, email_principal: this.form_email_principal, fone_res: this.form_fone_res})
    .subscribe({
      next: (_) => {
        // Limpa qualquer mensagem de erro existente
        this.errorMessage = '';
        // Define a mensagem de sucesso
        this.successMessage = 'Pessoa cadastrada com sucesso!';
        // Atualiza a lista de pessoas cadastradas
        this.obterPessoasCadastradas();
      },
      error: (error) => {
        // Limpa qualquer mensagem de sucesso existente
        this.successMessage = '';
        // Define a mensagem de erro
        this.errorMessage = 'Ocorreu um erro desconhecido ao cadastrar a pessoa. Detalhes: ' + error.message;
      }
    });
  
  }
  
  //operação de atualizar pessoa com dados do formulário ----------------------------------------------
  atualizar(){
    this.pessoaService.editarPessoa({ 
      id: parseInt(this.form_id), nome_pessoa: this.form_nome_pessoa, email_principal: this.form_email_principal, fone_res: this.form_fone_res})
      .subscribe({
        next: (_) => {
          console.log("nome_pessoa:", this.form_nome_pessoa, "email_principal:", this.form_email_principal, "fone_res:", this.form_fone_res)
          // Limpa qualquer mensagem de erro existente
          this.errorMessage = '';
          // Define a mensagem de sucesso
          this.successMessage = 'Pessoa alterada com sucesso!';
          // Atualiza a lista de pessoas cadastradas
          this.obterPessoasCadastradas();
        },
        error: (error) => {
          // Limpa qualquer mensagem de sucesso existente
          this.successMessage = '';
          // Define a mensagem de erro
          this.errorMessage = 'Ocorreu um erro desconhecido ao alterar a pessoa. Detalhes: ' + error.message;
        }
      });
    
  }
  
  //operação de remover pessoa ao clicar no link/botão de exclusão ----------------------------------------------
  remover(id: number){
    this.pessoaService.remover(id)
	  .subscribe({
		  next: (response) => {
		  // Limpa qualquer mensagem de erro existente
		  this.errorMessage = '';
		  // Define a mensagem de sucesso
		  this.successMessage = 'Pessoa removida com sucesso!';
		  // Atualiza a lista de pessoas cadastradas
		  this.obterPessoasCadastradas();
		  },
		  error: (error) => {
		  // Limpa qualquer mensagem de sucesso existente
		  this.successMessage = '';
		  // Define a mensagem de erro
		  this.errorMessage = 'Ocorreu um erro ao remover a pessoa. Detalhes: ' + error.message;
		  }
	  });
  }
  
  
}
