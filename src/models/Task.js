import Sequelize from 'sequelize';

export default (connect) => {
  const Task = connect.define('Task', {
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      validate: {
        notEmpty: true,
      },
    },
    creator: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    assignedTo: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    tags: {
      type: Sequelize.STRING,
    },
  },
    {
      classMethods: {
        associate: (models) => {
          Task.belongsTo(models.TaskStatus, { foreignKey: 'status' });
          Task.belongsTo(models.User, { as: 'Assignee', foreignKey: 'assignedTo' });
          Task.belongsTo(models.User, { as: 'Creator', foreignKey: 'creator' });
        },
      },
      freezeTableName: true,
    });
  return Task;
};
