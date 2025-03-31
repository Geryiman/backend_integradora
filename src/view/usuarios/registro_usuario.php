<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar usuario</title>
    <link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/general.css">
</head>

<body>
    <a href="gestion_usuarios.php">Regresar</a>
    <!-- <form action="../../controller/usuarios/proceso_registro_usuario.php" method="POST">
        <label for="">Nombre:</label><br>
        <input type="text" name="nombre" id="nombre">
        <br>
        <br>
        <label for="">E-mail:</label><br>
        <input type="email" name="email" id="email">
        <br>
        <br>
        <label for="">Contraseña:</label><br>
        <input type="password" name="password" id="password">
        <br>
        <br>
        <input type="submit" value="AGREGAR USUARIO">
    </form> -->
    <div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Registro de Usuario</strong>
            </div>
            <div class="card-body">
                <form action="../../controllers/usuarios/proceso_registro_usuario.php" method="POST" enctype="multipart/form-data">
                    <div class="mb-3">
                        <input type="text" class="form-control mb-3" placeholder="Nombre" name="nombre">
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control mb-3" placeholder="Correo Electrónico" aria-describedby="emailHelp" name="email">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control mb-3" placeholder="Contraseña" name="password">
                    </div>
                    <div class="mb-3">
                        <input type="file" class="form-control mb-3" placeholder="Selecciona una imagen" name="imagen">
                    </div>
                    <button type="submit" class="btn btn-primary">AGREGAR USUARIO</button>
                </form>
            </div>
        </div>
    </div>

</body>

</html>