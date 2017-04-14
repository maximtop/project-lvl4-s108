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
  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
  return models;
};
