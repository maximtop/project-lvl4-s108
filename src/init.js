import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);
  await Promise.all(Object.values(models).map(async model => model.sync({ force: true })));
  await models.TaskStatus.bulkCreate([
    { name: 'New' },
    { name: 'In Progress' },
    { name: 'On testing' },
    { name: 'Completed' },
  ]);
};
