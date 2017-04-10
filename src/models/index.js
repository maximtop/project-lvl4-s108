import getUser from './User';
import getTaskStatus from './TaskStatus';
import getTask from './Task';

export default (connect) => {
  const models = {
    User: getUser(connect),
    TaskStatus: getTaskStatus(connect),
    Task: getTask(connect),
  };
  Object.keys(models).forEach((modelName) => {
    console.log(models[modelName]);
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
  // models.TaskStatus.hasMany(models.Task);
  // models.Task.belongsTo(models.TaskStatus);
  return models;
};
