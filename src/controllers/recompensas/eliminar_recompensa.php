<?php  
	require('../../models/conectar.php');

	$id_recompensa = $_REQUEST['id_recompensa'];

	$consulta = "DELETE FROM recompensas WHERE id_recompensa = '$id_recompensa'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();

	if ($resultado) {
		header('Location: ../../view/recompensas/gestion_recompensas.php');

	}
	else {
		echo "No se pudo eliminar";
	}
	?>