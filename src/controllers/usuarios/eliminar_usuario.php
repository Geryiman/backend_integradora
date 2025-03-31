<?php  
	require('../../models/conectar.php');

	$id_usuario = $_REQUEST['id_usuario'];

	$consulta = "DELETE FROM usuarios WHERE id_usuario = '$id_usuario'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();

	if ($resultado) {
		header('Location: ../../view/usuarios/gestion_usuarios.php');

	}
	else {
		echo "No se pudo eliminar";
	}
	?>