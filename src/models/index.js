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
  // Object.values(models).forEach((model) => {
  //   if ('associate' in model) {
  //     model.associate(models);
  //   }
  // });
  return models;
};
