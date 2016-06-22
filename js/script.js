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
			    $("h2").html("Carregado");
			    montandoTabela(retorno);
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
        
        var nameTd = $(this).attr("name"); //Pegar o atributo name da td alterada.
        var idTd = $(this).attr("id"); //Pegar o atributo id da td alterada;
        
        $(this).addClass("celulaEmEdicao");
        $(this).html("<input type='text' value='" + conteudoOriginal + "' />");
        $(this).children().first().focus();

        $(this).children().first().keypress(function (e) {
            if (e.which == 13) {
                var novoConteudo = $(this).val();
                $(this).parent().text(novoConteudo);
                $(this).parent().removeClass("celulaEmEdicao");
                alert("O usuario Alterou seu " + nameTd + " para: " + novoConteudo + " id: " + idTd); //Pegar qual o campo que o usuário está editando.
            	atualizar(nameTd, novoConteudo, idTd); //Atualizando o registro
            }
        });
		
		$(this).children().first().blur(function(){ //Voltando tabela ao normal
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
				//carregarItens();
		    }
		}
	});
}

//Utilizado para cadastrar novos alunos.
function novo() {

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

function montandoTabela(retorno){
	var keys = Object.keys(retorno[0]); //Pegar as keys do objeto javascript
	table = document.getElementById("minhaTabela"); //Pegar tabela pelo id
	tbody = document.getElementById("bodyTabela"); //Pegar tbody pelo id

	for (var i=0;i<10;i++) {
    	var tr = document.createElement("tr");
    	
    	chkbox = document.createElement("input"); //criando input checkbox
		chkbox.type = "checkbox";
    	var x = tr.insertCell(0); //inserindo colunas em todas as tr
    	x.appendChild(chkbox); //inserindo checkboxs em todas as colunas
        
        for(var j=0;j<8;j++){
            var td = document.createElement("td");
            var texto=document.createTextNode(retorno[i][keys[j]]);
            td.setAttribute("name", keys[j]); //Adicionando name para todas as tds.
            td.setAttribute("id", retorno[i].id); //Adicionando id para todas as tds.
            td.appendChild(texto);
            tr.appendChild(td);
        }
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	alterarItensTable();
}


function dropRow() {
	try {
	var table = document.getElementById("minhaTabela");
	var rowCount = table.rows.length;
	for(var i = 0; i < rowCount; i++ ) {
		var row = table.rows[i]; //Pegar linha da tabela
		var chkbox = row.cells[0].childNodes[0]; //Pegar checkbox dentro da "td"
		if(null != chkbox && true == chkbox.checked) { //Saber se esta check
			if(rowCount <= 1) {
				alert("Cannot delete all the rows.");
				break;
			}
			var id = table.rows[i].cells[1].innerHTML; //coluna id da linha selecionada
			console.log(id);
			table.deleteRow(i); //Metodo javascript
			deletar(id);
			rowCount--;
			i--;
		}
	}
	}catch(e) {
		alert(e);
	}
}

function read(aluno){
	var alunos = [];
	var aluno = {
	    'nome': table.rows[i].cells[2].innerHTML, // valor da coluna Produto
	    'login': table.rows[i].cells[3].innerHTML // Valor da coluna Quantidade
  	};
  	alunos.push(aluno);
  	read(alunos);

	alert(pedido[0].nome);
}