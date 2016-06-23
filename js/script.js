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
	$("td").dblclick(function () {
        var conteudoOriginal = $(this).text();
        
        var nameTd = $(this).attr("name"); //Pegar o atributo name da td alterada.
        var idTd = $(this).attr("id"); //Pegar o atributo id da td alterada;
        
        $(this).addClass("celulaEmEdicao");
        $(this).html("<input class='form-control' type='text' value='" + conteudoOriginal + "' />");
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
function novoAluno() {
	div = document.getElementById("divRead");
	div.style.visibility = "visible";

	btn = document.getElementById("salvar");
	btn.addEventListener("click", function(){
		var inputNome = document.getElementById("nome").value;
		var inputLogin = document.getElementById("login").value;
		var inputSenha = document.getElementById("senha").value;
		var inputCarteira = document.getElementById("carteira").value;
		var inputCidade = document.getElementById("cidade").value;
		var inputEstado = document.getElementById("estado").value;
		var inputNascimento = document.getElementById("data_nascimento").value;
		
		//Metodo Ajax para inserir
		salvarAluno(inputNome,inputLogin,inputSenha,inputCarteira,inputCidade,
		inputEstado,inputNascimento);

		//Esconder a div flutuante
		div = document.getElementById("divRead");
		div.style.visibility = "hidden";
		alert('');
	});
} 

function salvarAluno(nome,login,senha,carteira,cidade,estado,data_nascimento){
	var url = "dados.php";
	$.ajax({
		url: url,
		cache: false,
		type: "POST",
		dataType: "json",
		data: {	"nome":nome, 
				"login":login, 
				"senha":senha, 
				"carteira":carteira, 
				"cidade":cidade, 
				"estado":estado,
				"data_nascimento":data_nascimento,
				"action": "inserir"
		},
		beforeSend: function(){
			$("h2").html("Inserindo...");	
		},
		error: function(){
			$("h2").html("Há algum problema com a base de dados");	
		},
		success: function(retorno){
			if(retorno[0].erro){
				$("h2").html(retorno[0].erro);
			}else{
				$("h2").html(retorno[0].mensagem);
			}
		}
	});
}


function montandoTabela(retorno){
	var keys = Object.keys(retorno[0]); //Pegar as keys do objeto javascript
	table = document.getElementById("minhaTabela"); //Pegar tabela pelo id
	tbody = document.getElementById("bodyTabela"); //Pegar tbody pelo id
	tbody.innerHTML = "";
	for (var i = 0; i < 10; i++) {
    	var tr = document.createElement("tr");
    	
    	//checkbox dentro da tabela dinamico
    	chkbox = document.createElement("input"); //criando input checkbox
		chkbox.type = "checkbox";
    	var x = tr.insertCell(0); //inserindo colunas em todas as tr
    	x.appendChild(chkbox); //inserindo checkboxs em todas as colunas
        
        for(var j = 0; j < 8; j++){
            var td = document.createElement("td");
            var texto = document.createTextNode(retorno[i][keys[j]]);
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
			//console.log(id);
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

function readMetodo(){
	div = document.getElementById("divRead");
	div.style.visibility = "visible";

	try {
	var table = document.getElementById("minhaTabela");
	var rowCount = table.rows.length;
	for(var i = 0; i < rowCount; i++ ) {
		var row = table.rows[i]; //Pegar linha da tabela
		var chkbox = row.cells[0].childNodes[0]; //Pegar checkbox dentro da "td"
		if(null != chkbox && true == chkbox.checked) { //Saber se esta check
			chkbox.checked = false;
			//Pegando os inputs
			var inputNome = document.getElementById("nome");
			var inputLogin = document.getElementById("login");
			var inputSenha = document.getElementById("senha");
			var inputCarteira = document.getElementById("carteira");
			var inputCidade = document.getElementById("cidade");
			var inputEstado = document.getElementById("estado");
			var inputNascimento = document.getElementById("data_nascimento");
			
			//pegando os valores da tabela inserindo em variaveis
			var id = table.rows[i].cells[1].innerHTML; //coluna id da linha selecionada
			var nome = table.rows[i].cells[2].innerHTML; 
			var login = table.rows[i].cells[3].innerHTML;
			var senha = table.rows[i].cells[4].innerHTML;
			var carteira = table.rows[i].cells[5].innerHTML;
			var cidade = table.rows[i].cells[6].innerHTML; 
			var estado = table.rows[i].cells[7].innerHTML; 
			var data_nascimento = table.rows[i].cells[8].innerHTML;
			
			//Adicionando valor das variaveias ao value input
			inputNome.value = nome;
			inputLogin.value = login;
			inputSenha.value = senha;
			inputCarteira.value = carteira;
			inputCidade.value = cidade;
			inputEstado.value = estado;
			inputNascimento.value = data_nascimento;
			rowCount--;
			i--;
		}
	}
	}catch(e) {
		alert(e);
	}
}

function cancelar(){
	div = document.getElementById("divRead");
	div.style.visibility = "hidden";
}