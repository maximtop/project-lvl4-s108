import getUser from './User';
import getTaskStatus from './TaskStatus';
import getTask from './Task';
import getTag from './Tag';
import getTaskTag from './TaskTag';

export default (connect) => {
  const models = {
    User: getUser(connect),
    TaskTag: getTaskTag(connect),
    TaskStatus: getTaskStatus(connect),
    Tag: getTag(connect),
    Task: getTask(connect),
  };
  models.Tag.belongsToMany(models.Task, { through: 'TaskTag' });
  models.Task.belongsTo(models.TaskStatus, { foreignKey: 'status' });
  models.Task.belongsTo(models.User, { as: 'Assignee', foreignKey: 'assignedTo' });
  models.Task.belongsTo(models.User, { as: 'Creator', foreignKey: 'creator' });
  models.Task.belongsToMany(models.Tag, { through: 'TaskTag' });
  models.TaskStatus.hasMany(models.Task);
  models.User.hasMany(models.Task, { as: 'AssignedTask', foreignKey: 'assignedTo' });
  // Object.values(models).forEach((model) => {
  //   if ('associate' in model) {
  //     model.associate(models);
  //   }
  // });
  return models;
};
