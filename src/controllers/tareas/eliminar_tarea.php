<?php  
	require('../../models/conectar.php');

	$id_tarea = $_REQUEST['id_tarea'];

	$consulta = "DELETE FROM tareas WHERE id_tarea = '$id_tarea'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();

	if ($resultado) {
		header('Location: ../../view/tareas/gestion_tareas.php');

	}
	else {
		echo "No se pudo eliminar";
	}
	?>