import url from 'url';
import rollbar from 'rollbar';
import buildFormObj from '../lib/formObjectBuilder';
import isSignedIn from '../lib/isSignedIn';

const getTagNames = rawTagsData =>
  rawTagsData.split(',')
    .map(tagName => tagName.trim())
    .filter(tagName => tagName.length > 0);

const getFilter = (query) => {
  const { creator, tag, status, assignee } = query;
  const searches = {
    creator: { id: creator },
    tag: { id: tag },
    status: { id: status },
    assignee: { id: assignee },
  };
  return Object.keys(searches).reduce((obj, searchKey) => {
    if (searches[searchKey].id === 'All' || searches[searchKey].id === undefined) {
      return { ...obj, [searchKey]: {} };
    }
    return { ...obj, [searchKey]: searches[searchKey] };
  }, {});
};

export default (router, { Task, User, TaskStatus, Tag }) => {
  router
    .use('/tasks', isSignedIn)
    .get('tasks', '/tasks', async (ctx) => {
      try {
        const { query } = url.parse(ctx.request.url, true);
        const filter = getFilter(query);
        const tasks = await Task.findAll({
          include: [
            { model: User, as: 'Assignee', where: filter.assignee },
            { model: TaskStatus, where: filter.status },
            { model: Tag, where: filter.tag },
            { model: User, as: 'Creator', where: filter.creator },
          ],
        });
        const users = await User.findAll();
        const taskStatuses = await TaskStatus.findAll();
        const tags = await Tag.findAll();
        const search = {};
        ctx.render('tasks', { f: buildFormObj(search), tasks, users, taskStatuses, tags });
      } catch (e) {
        console.log(e);
        rollbar.handleError(e);
      }
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      try {
        const task = Task.build();
        const users = await User.findAll();
        const taskStatuses = await TaskStatus.findAll();
        ctx.render('tasks/new', { f: buildFormObj(task), users, taskStatuses });
      } catch (e) {
        rollbar.handleError(e);
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
        rollbar.handleError(e);
        ctx.render('tasks/new', { f: buildFormObj(task, e), users, taskStatuses });
      }
    })
    .get('task', '/tasks/:id', async (ctx) => {
      try {
        const task = await Task.findById(ctx.params.id,
          {
            include: [TaskStatus,
              { model: User, as: 'Creator' },
              { model: User, as: 'Assignee' },
              Tag],
          });
        ctx.render('tasks/task', { task });
      } catch (e) {
        rollbar.handleError(e);
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
      const users = await User.findAll();
      const taskStatuses = await TaskStatus.findAll();
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
        await task.setTags([]);
        const tagNames = getTagNames(form.tags);
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
        ctx.flash.set('task info was updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        rollbar.handleError(e);
        ctx.render('tasks/edit', { f: buildFormObj(task, e), users, taskStatuses });
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
