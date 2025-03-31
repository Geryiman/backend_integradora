<?php 
require('../models/conectar.php');
$nombre = $_POST['nombre'];
$email = $_POST['email'];
                
$consulta = "SELECT password FROM usuarios WHERE nombre = '$nombre' AND email = '$email'";
$resultado = $Conexion->query($consulta);


if ($resultado && $fila = $resultado->fetch()) {
    $resultado = $fila['password'];
    echo '<script language="javascript">alert("SU CONTRASEÑA ES: ' . $resultado . '");window.location.href="../index.php"</script>';
} else {
    echo '<script language="javascript">alert("NO SE ENCONTRO LA CONTRASEÑA");window.location.href="../index.php"</script>';
}
?>
