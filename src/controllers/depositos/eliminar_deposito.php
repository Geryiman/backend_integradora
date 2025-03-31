<?php  
	require('../../model/conectar.php');

	$id_deposito = $_REQUEST['id_deposito'];

	$consulta = "DELETE FROM depositos WHERE id_deposito = '$id_deposito'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();

	if ($resultado) {
		header('Location: ../../view/depositos/gestion_depositos.php');

	}
	else {
		echo "No se pudo eliminar";
	}
	?>