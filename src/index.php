<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
</head>

<body>
    <!-- <div class="contenedor mt-5">
                <form action="./controller/inicio_proceso.php" method="POST">
                    <input type="text" name="usuario" class="form-control mb-4" placeholder="Usuario">
                    
                    <input type="password" name="password" class="form-control mb-4" placeholder="Contraseña">
                    
                    <input type="submit" value="Iniciar Sesión" class="btn btn-primary mb-4">
                    
                    <p>¿Olvido su contraseña? <a href="view/recuperar_password.php"> Recuperela aquí</a></p>
                </form>
            </div> -->

    <div class="cotenedor-tarjeta mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Inicio de Sesión</strong>
            </div>
            <div class="card-body">
            <form action="./controllers/inicio_proceso.php" method="POST">
                    <input type="text" name="usuario" class="form-control mb-4" placeholder="Usuario" required>
                    
                    <input type="password" name="password" class="form-control mb-4" placeholder="Contraseña" required>
                    
                    <input type="submit" value="Iniciar Sesión" class="btn btn-primary mb-4">
                    
                </form>
            </div>
            <div class="card-footer text-body-secondary">
            <p>¿Olvido su contraseña? <a href="view/recuperar_password.php"> Recuperela aquí</a></p>
            </div>
        </div>
    </div>
</body>

</html>