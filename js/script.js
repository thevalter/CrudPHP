/**
* Capturar itens do banco de dados
*/
function carregarItens(){
	valor = document.getElementById("q").value;
	//variáveis
	var itens = "", url = "dados.php";

    //Capturar Dados Usando Método AJAX do jQuery
    $.ajax({
	    url: url, //URL de requisição
	    cache: false, //false para não guardar informações em cache
	    type: "POST", //Tipo de requisição
	    dataType: "json", //Necessario pois estamos trabalhando com json
	    data: {"id": valor, "action": "list"}, //Enviando paramentros para o servidor
	    beforeSend: function() { //Antes de enviar executa algo
		    $("h2").html("Carregando..."); //Carregando
	    },
	    error: function() { //Caso de erro cai aqui
		    $("h2").html("Há algum problema com a fonte de dados");
	    },
	    success: function(retorno) { //Sucesso @retorno retorno do servidor
		    if(retorno[0].erro){
			    $("h2").html(retorno[0].erro);
		    }
		    else{
			    //Laço para criar linhas da tabela
			    /*TODO refatorar*/
			    for(var i = 0; i<retorno.length; i++){
				    itens += "<tr>";
					    itens += "<td name='id' id='" + retorno[i].id +"'>" + retorno[i].id + "</td>";
					    itens += "<td name='nome' id='" + retorno[i].id +"'>" + retorno[i].nome + "</td>";
					    itens += "<td name='login' id='" + retorno[i].id +"'>" + retorno[i].login + "</td>";
					    itens += "<td name='senha' id='" + retorno[i].id +"'>" + retorno[i].senha + "</td>";
					    itens += "<td name='carteira' id='" + retorno[i].id +"'>" + retorno[i].carteira + "</td>";
					    itens += "<td name='cidade' id='" + retorno[i].id +"'>" + retorno[i].cidade + "</td>";
					    itens += "<td name='estado' id='" + retorno[i].id +"'>" + retorno[i].estado + "</td>";
					    itens += "<td name='data_nascimento' id='" + retorno[i].id +"'>" + retorno[i].data_nascimento + "</td>";
						itens += "<td width=250 name='action' id='" + retorno[i].id +"'>";
	                    itens += "<a class='btn' href='#'>Read</a>";
	                    itens += " ";
	                    itens += "<a id='update' class='btn btn-success' onclick='atualizar("+retorno[i].id+")' href='#'>Update</a>";
	                    itens += " ";
	                    itens += "<a id='deletar' class='btn btn-danger' onclick='deletar("+retorno[i].id+")' href='#'>Delete</a>";
	                    itens += "</td>";	
					itens += "</tr>";
			    }
			    //Preencher a Tabela
			    $("#minhaTabela tbody").html(itens);
			    alterarItensTable(); //Apenas chamando a função após popular toda a tabela
			    //Limpar Status de Carregando

			    $("h2").html("Carregado");
		    }
	    }
    });
}

function alterarItensTable(){ //Pegar valor elementos td da tabela
	//var alteracao = prompt("Digite a alteração");

	/*
	
	for(i = 0; i < 7; i++){
		tr[1].getElementsByTagName("td")[i].innerHTML=alteracao;
	} */
	/*
	tr = document.getElementsByTagName("tr");
	td = document.getElementsByTagName('td');
	alert(tr[1].getElementsByTagName('td')[1].innerHTML);

	for(i=0;i<td.length;i++){
		td[i].onclick=function(){this.innerHTML=prompt("Digite a alteração",this.innerHTML)}
	}
	*/

	/* Pegar id da linha selecionada
	$(function () {
    $("tr").dblclick(function () { 
    	var id = $(this).attr('id');
    	alert(id);

    });
    */

    $("td").dblclick(function () {
        var conteudoOriginal = $(this).text();
        
        var nameTd = $(this).attr("name"); //Pegar o name da td alterada.
        var idTd = $(this).attr("id"); //Pegar id da td alterada;
        
        $(this).addClass("celulaEmEdicao");
        $(this).html("<input type='text' value='" + conteudoOriginal + "' />");
        $(this).children().first().focus();

        $(this).children().first().keypress(function (e) {
            if (e.which == 13) {
                var novoConteudo = $(this).val();
                $(this).parent().text(novoConteudo);
                $(this).parent().removeClass("celulaEmEdicao");
                alert("O usuario Alterou seu " + nameTd + " para: " + novoConteudo + " id: " + idTd); //Pegar qual o campo que o usuário está editando.
            	atualizar(nameTd, novoConteudo, idTd);
            }
        });
		
		$(this).children().first().blur(function(){
			$(this).parent().text(conteudoOriginal);
			$(this).parent().removeClass("celulaEmEdicao");
		});
    });

}

function atualizar(nomeCampo,novoConteudo, id){ //Adicionar um novo evento que será chamado quando clicar em deletar.
	var url = "dados.php";
	$.ajax({
		url: url,
		cache: false,
		type: "POST",
		dataType: "json",
		data: {"nomeCampo": nomeCampo, "novoConteudo": novoConteudo, "id": id, "action": "atualizar"},
		beforeSend: function(){
			$("h2").html("Atualizando...");
		},
		error: function(){
			$("h2").html("Há algum problema com a base de dados");
		},
		success: function(retorno){
			if(retorno[0].erro){
			    $("h2").html(retorno[0].erro);
		    }else{
				$("h2").html(retorno[0].mensagem);
				//carregarItens();
		    }
		}
	});
}

function deletar(id){ //Adicionar um novo evento que será chamado quando clicar em deletar.
	var url = "dados.php";
	$.ajax({
		url: url,
		cache: false,
		type: "POST",
		dataType: "json",
		data: {"id": id, "action": "deletar"},
		beforeSend: function(){
			$("h2").html("Deletando...");
		},
		error: function(){
			$("h2").html("Há algum problema com a base de dados");
		},
		success: function(retorno){
			if(retorno[0].erro){
			    $("h2").html(retorno[0].erro);
		    }else{
				$("h2").html(retorno[0].mensagem);
				carregarItens();
		    }
		}
	});
}

//Utilizado para cadastrar novos alunos.
function inserirLinhaTabela() {

    // Captura a referência da tabela com id “minhaTabela”
    var table = document.getElementById("minhaTabela");
    // Captura a quantidade de linhas já existentes na tabela
    var numOfRows = table.rows.length;
    // Captura a quantidade de colunas da última linha da tabela
    var numOfCols = table.rows[numOfRows-1].cells.length;

    // Insere uma linha no inicio da tabela da tabela.
    var newRow = table.insertRow(1);

    // Faz um loop para criar as colunas
    for (var j = 0; j < numOfCols; j++) {
        // Insere uma coluna na nova linha 
        newCell = newRow.insertCell(j);
        // Insere um conteúdo na coluna
        //newCell.innerHTML = "Linha "+ numOfRows + " -Coluna "+ j;
        newCell.innerHTML = "<input type='text'/>" //insere um input no conteudo da coluna
    }
} 