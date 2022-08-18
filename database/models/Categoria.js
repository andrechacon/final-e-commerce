module.exports = (sequelize, dataTypes) => {

   /* let alias = 'Categoria';*/
    let cols = {
       id:{
        type: dataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
       },
       nombre:{
         type: dataTypes.STRING(45),
         allowNull: false,
        },
    };

    let config = {
       tableName:'categorias',
       timestamps: false,
    };

    const Categoria = sequelize.define("Categoria", cols, config);

    Categoria.associate = models => {
        Categoria.hasMany(models.Producto, {
            as: 'products',
            foreignKey: 'categoria_id',
        })
    }


    return Categoria;

}