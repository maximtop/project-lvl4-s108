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
    Task: getTask(connect),
    Tag: getTag(connect),
  };
  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
  return models;
};
