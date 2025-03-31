<?php  
require ('../../models/conectar.php');
$id_rango = $_REQUEST['id_rango'];
 $rango = $_POST['rango'];
 $puntosmin = $_POST['puntosmin'];
 $puntosmax = $_POST['puntosmax'];

$modificacion = "UPDATE rangos SET nombre_rango='$rango', puntos_minimos='$puntosmin', puntos_maximos='$puntosmax'
 WHERE id_rango ='$id_rango'";
$resultado = $Conexion->prepare($modificacion);
$resultado->execute();

if ($resultado) {
	header('Location: ../../view/rangos/gestion_rangos.php');
} else {
	echo "fallo la modificacion";
}
?>