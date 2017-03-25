import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .get('/users/:id', async (ctx) => {
      const user = await User.findById(ctx.params.id);
      ctx.render('users/profile', { user });
    })
    .patch('/users/:id', async (ctx) => {
      ctx.flash.set('button edit works');
      ctx.redirect(router.url('root'));
    })
    .delete('/users/:id', async (ctx) => {
      ctx.flash.set('button delete works');
      ctx.redirect(router.url('root'));
    });
  
};
