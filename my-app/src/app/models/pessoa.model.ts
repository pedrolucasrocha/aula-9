export type Pessoa =  {
	id: number,
	nome_pessoa: string,
	email_principal: string,
	fone_res: string,
}

export type PessoaCadastrar = Omit<Pessoa, 'id'>;