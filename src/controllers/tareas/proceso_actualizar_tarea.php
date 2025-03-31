<?php  
require ('../../models/conectar.php');
$id_tarea = $_REQUEST['id_tarea'];
$tarea = $_POST['tarea'];
$puntos = $_POST['puntos'];
$tipo = $_POST['tipo'];
$fechaInicio = $_POST['fechaInicio'];
$fechaFin = $_POST['fechaFin'];
$botellas = $_POST['botellas'];

$modificacion = "UPDATE tareas SET descripcion='$tarea', puntos='$puntos', tipo='$tipo',fecha_inicio='$fechaInicio',fecha_fin='$fechaFin',botellas_necesarias='$botellas'
 WHERE id_tarea ='$id_tarea'";
$resultado = $Conexion->prepare($modificacion);
$resultado->execute();

if ($resultado) {
	header('Location: ../../view/tareas/gestion_tareas.php');
} else {
	echo "fallo la modificacion";
}
?>