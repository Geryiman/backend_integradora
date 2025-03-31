<?php  
	require ('../../models/conectar.php');
	$rango = $_POST['rango'];
	$puntosMin = $_POST['puntos_minimos'];
	$puntosMax = $_POST['puntos_maximos'];

	$insertar = "INSERT INTO rangos (id_rango, nombre_rango, puntos_minimos, puntos_maximos) VALUES
    (null,'$rango','$puntosMin','$puntosMax')";

	$resultado=$Conexion->prepare($insertar);
	$resultado->execute();

	if ($resultado) {
		echo '<script language="javascript">alert("REGISTRO GUARDADO");window.location.href="../../view/rangos/gestion_rangos.php"</script>';
	}else
	{
	echo "Fallo la insercion";
	}
?>