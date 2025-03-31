<?php  
	require ('../../models/conectar.php');
	$tarea = $_POST['tarea'];
	$puntos = $_POST['puntos'];
	$tipo = $_POST['tipo'];
	$fechaInicio = $_POST['fechaInicio'];
	$fechaFin = $_POST['fechaFin'];
	$botellas = $_POST['botellas'];

		$insertar = "INSERT INTO tareas (id_tarea, descripcion, puntos, tipo, fecha_inicio, fecha_fin, botellas_necesarias) VALUES
        (null,'$tarea','$puntos','$tipo','$fechaInicio','$fechaFin','$botellas')";

	$resultado=$Conexion->prepare($insertar);
	$resultado->execute();

	if ($resultado) {
		
		echo '<script language="javascript">alert("REGISTRO GUARDADO");window.location.href="../../view/tareas/gestion_tareas.php"</script>';
	}else
	{
	echo "Fallo la insercion";
	}
?>