<?php
header("Content-Type:" . "text/plain"); //Facilitar a vizualização do json
/*Conexão Banco de Dados*/
$servername = "localhost";
$username = "root";
$password = "valter";

// Create connection
$con = mysqli_connect($servername, $username, $password);
$selected = mysqli_select_db($con,"mydb");

// Check connection
if (!$con) {
    echo '[{"erro": "Não foi possível conectar ao banco"';
	echo '}]';
}
//echo "Connected successfully";
/*Conexão Banco de Dados*/
if($_POST["action"] == "list"){
	$query = "SELECT * FROM aluno ORDER BY id DESC";
	$result = $con->query($query);
	while($row = $result->fetch_assoc()){	
		$alunos[] = $row;
	}
	// can convert array to json string here and print
	echo json_encode($alunos, JSON_PRETTY_PRINT);
}

if($_POST["action"] == "deletar"){
	$query = "DELETE FROM aluno where id=" . $_POST["id"];
	$result = $con->query($query);
	echo '[{"mensagem": "Deletado com sucesso!"';
	echo '}]';
}

if($_POST["action"] == "atualizar"){
	$campo = $_POST["nomeCampo"];
	$novo = $_POST["novoConteudo"];
	$id = $_POST["id"];
	
	$query = "UPDATE aluno set " .$campo. " = '" .$novo. "' where id= " .$id; //Criando um update totalmente dinamico, qualquer dado de qualquer campo sera alterado.
	$result = $con->query($query);
	if($result){
		echo '[{"mensagem": "Atualizado com sucesso!"';
		echo '}]';	
	}else{
		echo '[{"mensagem": "Erro ao atualizar!"';
		echo '}]';		
	}
	
}

//Metodo insert
if($_POST["action"] == "inserir"){
	$nome = $_POST["nome"];
	$login = $_POST["login"];
	$senha = $_POST["senha"];
	$carteira = $_POST["carteira"];
	$cidade = $_POST["cidade"];
	$estado = $_POST["estado"];
	$data_nascimento = $_POST["data_nascimento"];

	
	//$query = "INSERT INTO aluno(nome,login,senha,carteira,cidade,estado,data_nascimento) values($nome, $login, $senha, $carteira, $cidade, $estado, $data_nascimento)";
	$query = "INSERT INTO aluno (`nome`,`login`,`senha`,`carteira`,`cidade`,`estado`,`data_nascimento`) VALUES ('".$nome."', '".$login."', '".$senha."', '".$carteira."', '".$cidade."', '".$estado."', '".$data_nascimento."')";
	$result = $con->query($query);
	if($result){
		echo '[{"mensagem": "Inserido com sucesso!"';
		echo '}]';	
	}else{
		echo '[{"mensagem": "Erro ao inserir!"';
		echo '}]';		
	}
}
?>

