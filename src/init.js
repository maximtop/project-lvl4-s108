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
  await models.User.bulkCreate([
    { email: 'maximtop1@gmail.com', firstName: 'Maxim1', lastName: 'Topciu1', passwordDigest: '123' },
    { email: 'maximtop2@gmail.com', firstName: 'Maxim2', lastName: 'Topciu2', passwordDigest: '123' },
    { email: 'maximtop3@gmail.com', firstName: 'Maxim3', lastName: 'Topciu3', passwordDigest: '123' },
  ]);
  // await models.Task.bulkCreate([
  //   { name: 'Task1', creator: '1', assignedTo: '1' },
  //   { name: 'Task1', creator: '1', assignedTo: '2' },
  //   { name: 'Task1', creator: '1', assignedTo: '2' },
  // ]);
};
