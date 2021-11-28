/**
*   @swagger
*   components:
*      schemas:
*            user:
*                type: object
*                properties:
*                    id:
*                        type: integer
*                        description: idúnico y autoincremental
*                    name:
*                        type: string
*                        description: nombre del usuario
*                    email:
*                        type: string
*                        description: correo del usuario
*                    password:
*                        type: string
*                        description: contraseña del usuario
*                    state:
*                        type: integer
*                        description: si el valor es verdadero el usuario essta activo en caso contrario el usuario esta inactivo
*                required:
*                    - name
*                    - email
*                    - password
*                example:
*                    -id: 1
*                    -name: Luis Arispe
*                    -email: luis.arispe1991@gmail.com
*                    -password: 123456
*                    -state: 1
 */
// #################################################SERVICIO LOGIN######################################################
/**
 * @swagger
 *  /api/user/login:
 *      post:
 *          summary: Servicio para iniciar sesión
 *          tags: [user]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                          required:
 *                              - email
 *                              - password
 *                          example:
 *                              email: example@correo.cl
 *                              password: 123456
 *          responses:
 *              200:
 *                  description: Usuario inicio sesión
 *              400:
 *                  description: Falta algun parametro(email o password)
 *              403:
 *                  description: Usuario/Contraseña incorreta
 *              500:
 *                  description: Error de servidor, favor contactarse con el administrador
 *
 */
