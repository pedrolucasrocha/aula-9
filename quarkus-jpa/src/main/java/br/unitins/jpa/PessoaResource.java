package br.unitins.jpa;
import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.google.gson.Gson;


@Path("/pessoas")
public class PessoaResource {
    //GET: listar---------------------------------------------------
    @GET
    @Produces(MediaType.APPLICATION_JSON)    
    public String listar() {
        // obtendo-se uma lista de todas as pessoas de agenda
        List<Pessoa> lPessoas = Pessoa.listAll();

        return (new Gson()).toJson(lPessoas);
    }

    //POST: criar ----------------------------------------------
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(String pessoaJson) {
        try{
            Gson gson = new Gson();
            Pessoa pessoa = gson.fromJson(pessoaJson, Pessoa.class);


            //preenchendo alguns campos obrigatórios pela tabela agenda.pessoa
            pessoa.email_trabalho = "@";
            pessoa.endereco = "-";
            pessoa.fone_cel2 = "-";
            pessoa.fone_trabalho = "-";
            pessoa.observacao = "-";

            System.out.println(pessoa.toString()); //mostra propriedades do objeto pesso ano terminal (pode ser útil para depuração)
            
            pessoa.persist();

            // Retornando a resposta com o status 201 (Created) e a pessoa criada em formato JSON
            return Response.status(Response.Status.CREATED).entity(gson.toJson(pessoa)).build();
        }
        catch(Exception e)
        {
            e.printStackTrace(); // Log da exceção, podendo ser útil para os desenvolvedores
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("Ocorreu um erro ao persistir Pessoa. Detalhes da exceção capturada: " + e.getMessage())
                           .build();
        }
    }

    //PUT: alterar ----------------------------------------------
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("id") Long id, String pessoaJson) {
        try {
            Gson gson = new Gson();
            Pessoa pessoa = gson.fromJson(pessoaJson, Pessoa.class);
            Pessoa pessoaExistente = Pessoa.findById(id);

            if (pessoaExistente != null) {
                // Atualiza os campos da pessoa existente com os valores recebidos
                pessoaExistente.nome_pessoa = pessoa.nome_pessoa;
                pessoaExistente.email_principal = pessoa.email_principal;
                pessoaExistente.fone_res = pessoa.fone_res;
                
                // Persiste as alterações no banco de dados
                pessoaExistente.persist();

                // Retorna a resposta com o status 200 (OK) e a pessoa atualizada em formato JSON
                return Response.status(Response.Status.OK).entity(gson.toJson(pessoaExistente)).build();
            } else {
                // Retorna a resposta com o status 404 (Not Found) se a pessoa não for encontrada
                return Response.status(Response.Status.NOT_FOUND).entity("Pessoa não encontrada.").build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log da exceção
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("Ocorreu um erro ao atualizar Pessoa. Detalhes da exceção capturada: " + e.getMessage())
                        .build();
        }
    }

    //DELETE: excluir -------------------------------------------------
    @DELETE
    @Transactional
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        Pessoa pessoa = Pessoa.findById(id);
        Gson gson = new Gson();

        if(pessoa != null) {
            pessoa.delete();
            return Response.status(Response.Status.OK).entity(gson.toJson(pessoa)).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Pessoa não encontrada.").build();
        }

    }

}