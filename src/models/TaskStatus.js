import Sequelize from 'sequelize';

export default (connect) => {
  const TaskStatus = connect.define('TaskStatus', {
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
    //     TaskStatus.hasMany(models.Task);
    //   },
    // },
    freezeTableName: true,
  });
  return TaskStatus;
};
