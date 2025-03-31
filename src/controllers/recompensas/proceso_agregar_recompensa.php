<?php  
	require ('../../models/conectar.php');
	$recompensa = $_POST['recompensa'];
	$puntos = $_POST['puntos'];
	$stock = $_POST['stock'];

		$insertar = "INSERT INTO recompensas (id_recompensa, nombre, puntos_necesarios, stock) VALUES
        (null,'$recompensa','$puntos','$stock')";

	$resultado=$Conexion->prepare($insertar);
	$resultado->execute();

	if ($resultado) {
		
		echo '<script language="javascript">alert("REGISTRO GUARDADO");window.location.href="../../view/recompensas/gestion_recompensas.php"</script>';
	}else
	{
	echo "Fallo la insercion";
	}
?>