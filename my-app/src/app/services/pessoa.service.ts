import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { Pessoa, PessoaCadastrar } from "../models/pessoa.model";

@Injectable({
	providedIn: 'root'
})
export class PessoaService {
	private url = 'http://localhost:8080/pessoas';
	constructor(private httpClient: HttpClient){
	}
	
	obterPessoas(){
		return this.httpClient.get<Pessoa[]>(this.url);
	}
	
	cadastrarPessoa(pessoa: PessoaCadastrar){
		return this.httpClient.post<Pessoa>(this.url, pessoa);
    }

    editarPessoa(pessoa: Pessoa){
		return this.httpClient.put<Pessoa>(`${this.url}/${pessoa.id}`, pessoa);
    }

    remover(id: number){
		return this.httpClient.delete<void>(`${this.url}/${id}`);
    }
}