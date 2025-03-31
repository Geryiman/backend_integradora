<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles_iAdmin.css">
</head>
<body>
<ul class="nav nav-tabs py-2">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="interfaz_admin.php"><strong>Perfil</strong></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="usuarios/gestion_usuarios.php">Usuarios</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="tareas/gestion_tareas.php">Tareas</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="rangos/gestion_rangos.php">Rangos</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="recompensas/gestion_recompensas.php">Recompensas</a>
  </li>
  <li class="nav-item ms-auto me-3">
	<a class="btn btn-danger" href="../controllers/cerrar_sesion.php">Cerrar sesion</a>
  </li>
</ul>

<?php
	
	require ('../models/conectar.php');
	session_start();

?>

<div class="cotenedor-tarjeta mt-5">
  <div class="card text-center">
    <div class="card-header">
    Bienvenido
    </div>
    <div class="card-body">
      <h5 class="card-title"> <?php echo $_SESSION['NOMBRE'];?></h5>
      <p class="card-text"><?php echo $_SESSION['EMAIL'];?></p>
      <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
    </div>
    
  </div>
</div>
    <script src="../bootstrap/js/bootstrap.min.js"></script>
</body>
</html>