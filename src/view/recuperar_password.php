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
    <a href="../index.php">Regresar</a>
<div class="contenedor-form-recuperar mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Recuperar Contraseña</strong>
            </div>
            <div class="card-body">
    <form action="../controllers/proceso_recuperar.php" method="POST">
        
        <input type="text" name="nombre" id="" class="form-control mb-3" placeholder="Coloque su Nombre Completo">

        <input type="email" name="email" id="" class="form-control mb-3" placeholder="Coloque su Correo Electrónico">
        
        <input type="submit" value="Recuperar" class="btn btn-primary">
    </form>
    </div>
        </div>
    </div>
</body>
</html>