<?php  
	require('../../models/conectar.php');

	$id_rango = $_REQUEST['id_rango'];

	$consulta = "DELETE FROM rangos WHERE id_rango = '$id_rango'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();

	if ($resultado) {
		header('Location: ../../view/rangos/gestion_rangos.php');

	}
	else {
		echo "No se pudo eliminar";
	}
	?>