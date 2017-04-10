export default async (ctx, next) => {
  if (ctx.session.userId) {
    await next();
  } else {
    ctx.flash.set('Sign in first');
    ctx.redirect('/');
  }
};
