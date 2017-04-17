import Sequelize from 'sequelize';

export default (connect) => {
  const Tag = connect.define('Tag', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Value must not be empty',
        },
      },
    },
  }, {
    // classMethods: {
    //   associate: (models) => {
    //     Tag.belongsToMany(models.Task, { through: 'TaskTag' });
    //   },
    // },
    freezeTableName: true,
  });
  return Tag;
};
