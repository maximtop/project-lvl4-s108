import buildFormObj from '../lib/formObjectBuilder';
import isSignedIn from '../lib/isSignedIn';

const getTagNames = rawTagsData =>
  rawTagsData.split(',')
    .map(tagName => tagName.trim())
    .filter(tagName => tagName.length > 0);

export default (router, { Task, User, TaskStatus, Tag }) => {
  router
    .use('/tasks', isSignedIn)
    .get('tasks', '/tasks', async (ctx) => {
      try {
        const tasks = await Task.findAll({ include: [{ model: User, as: 'Assignee' }, TaskStatus] });
        ctx.render('tasks', { tasks });
      } catch (e) {
        console.log(e);
      }
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      try {
        const task = Task.build();
        const users = await User.findAll();
        const taskStatuses = await TaskStatus.findAll();
        console.log(ctx.session);
        ctx.render('tasks/new', { f: buildFormObj(task), users, taskStatuses });
      } catch (e) {
        console.log(e);
      }
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      form.creator = ctx.session.userId;
      const users = await User.findAll();
      const taskStatuses = await TaskStatus.findAll();
      const tagNames = getTagNames(form.tags);
      const task = Task.build(form);
      task.tags = form.tags;
      try {
        await task.save();
        if (tagNames.length > 0) {
          Promise.all(tagNames.map(async (tagName) => {
            const tag = await Tag.findOne({ where: { name: tagName } });
            if (tag) {
              await task.addTags(tag);
            } else {
              const addTag = await Tag.create({ name: tagName });
              await task.addTags(addTag);
            }
          }));
        }
        ctx.flash.set(`task *${form.name}* has been created`);
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        console.log(e);
        ctx.render('tasks/new', { f: buildFormObj(task, e), users, taskStatuses });
      }
    })
    .get('task', '/tasks/:id', async (ctx) => {
      try {
        const task = await Task.findById(ctx.params.id,
          { include: [TaskStatus,
          { model: User, as: 'Creator' },
          { model: User, as: 'Assignee' },
            Tag] });
        ctx.render('tasks/task', { task });
      } catch (e) {
        console.log(e);
      }
    })
    .get('taskEdit', '/tasks/:id/edit', async (ctx) => {
      const id = ctx.params.id;
      const task = await Task.findById(id, { include: [Tag] });
      const users = await User.findAll();
      const taskStatuses = await TaskStatus.findAll();
      task.tags = task.Tags.map(tag => tag.name).join(', ');
      ctx.render('tasks/edit', { f: buildFormObj(task), task, users, taskStatuses });
    })
    .patch('taskUpdate', '/tasks/:id', async (ctx) => {
      const id = ctx.params.id;
      const form = ctx.request.body.form;
      const task = await Task.findById(id);
      try {
        await task.update({
          name: form.name,
          description: form.description,
          assignedTo: form.assignedTo,
          status: form.status,
        }, {
          where: {
            id,
          },
        });
        const tagNames = getTagNames(form.tags);
        if (tagNames.length > 0) {
          Promise.all(tagNames.map(async (tagName) => {
            const tag = await Tag.findOne({where: {name: tagName}});
            if (tag) {
              await task.addTags(tag);
            } else {
              const addTag = await Tag.create({name: tagName});
              await task.addTags(addTag);
            }
          }));
        }
        ctx.flash.set('task info was updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.render('tasks/edit', { f: buildFormObj(task, e) });
      }
    })
    .delete('taskDelete', '/tasks/:id', async (ctx) => {
      const id = ctx.params.id;
      await Task.destroy({
        where: {
          id,
        },
      });
      ctx.flash.set(`task id #${id} has been deleted`);
      ctx.redirect(router.url('tasks'));
    });
};
