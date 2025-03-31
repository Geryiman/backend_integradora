<?php  
require ('../../models/conectar.php');
$id_usuario = $_REQUEST['id_usuario'];
 $nombre = $_POST['nombre'];
 $email = $_POST['email'];
 $password = $_POST['password'];
 $puntos = $_POST['puntos'];

 if (!empty($_FILES['imagen']['name'])) {
    $foto = $_FILES['imagen']['name'];
    $ruta = $_FILES['imagen']['tmp_name'];
    $destino = "../../Fotos/" . $foto;
    copy($ruta, $destino);
} else {
    $destino = $_POST['foto_actual'];
}


$modificacion = "UPDATE usuarios SET nombre='$nombre', email='$email', password='$password', puntos_totales='$puntos', profileImage='$destino' WHERE id_usuario ='$id_usuario'";
$resultado = $Conexion->prepare($modificacion);
$resultado->execute();

if ($resultado) {
	header('Location: ../../view/usuarios/gestion_usuarios.php');
} else {
	echo "fallo la modificacion";
}
?>