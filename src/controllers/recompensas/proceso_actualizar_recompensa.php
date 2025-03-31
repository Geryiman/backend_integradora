<?php  
require ('../../models/conectar.php');
$id_recompensa = $_REQUEST['id_recompensa'];
 $recompensa = $_POST['recompensa'];
 $puntos = $_POST['puntos'];
 $stock = $_POST['stock'];

$modificacion = "UPDATE recompensas SET nombre='$recompensa', puntos_necesarios='$puntos', stock='$stock'
 WHERE id_recompensa ='$id_recompensa'";
$resultado = $Conexion->prepare($modificacion);
$resultado->execute();

if ($resultado) {
	header('Location: ../../view/recompensas/gestion_recompensas.php');
} else {
	echo "fallo la modificacion";
}
?>