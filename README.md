# Next.js Teslo Store App

Para correr localmente, se necesita la base de datos.

``` js
docker-compose up -d
```

* El -d, significa __detached__  

MongoDB URL Local:

``` js
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

* Renombrar el archivo __.env.template__ a __.env__

## Llenar la base de datos con informacion de pruebas. Llamar a

* Reconstruir los modulos de node y levantar Next.

``` js
yarn install
yarn dev
```

* Llenar la base de datos haciendo una peticion a ese endpoint.

``` js
    http://localhost:3000/api/seed
```
