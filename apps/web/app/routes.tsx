import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./app.tsx', [
    index('./routes/home.tsx'),
    route('search', './routes/search.tsx'),
    route('inbox', './routes/inbox.tsx'),
    ...prefix('users', [
      index('./routes/users/dashboard.tsx'),
      route(':id', './routes/users/user.$id.tsx'),
    ]),
    route('support', './routes/support.tsx'),
    route('changelog', './routes/changelog.tsx'),
    route('profile', './routes/profile/profile.tsx', [
      route('edit', './routes/profile/profile.edit.tsx'),
    ]),
    route('settings', './routes/settings.tsx'),
    route('privacy', './routes/privacy.tsx'),
    route('feedback', './routes/feedback.tsx'),
    ...prefix('admin', [
      route('users', 'routes/admin/users/users.tsx', [
        route('new', './routes/admin/users/user.new.tsx'),
        route(':id', './routes/admin/users/user.$id.tsx', [
          route('edit', './routes/admin/users/user.$id.edit.tsx'),
        ]),
      ]),
      route('settings', './routes/admin/settings.tsx'),
    ]),
    ...prefix('cdk', [
      index('./routes/cdk/dashboard.tsx'),
      route('grid-layout', './routes/cdk/grid-layout.tsx'),
    ]),
  ]),
  layout('./auth.tsx', [
    route('login', './routes/_auth/login.tsx'),
    route('register', './routes/_auth/register.tsx'),
    route('forgot-password', './routes/_auth/forgot-password.tsx'),
    route('logout', './routes/_auth/logout.tsx'),
  ]),
  // Routes without DOM
  ...prefix('webauthn', [
    route('registration', './routes/_auth/webauthn/registration.ts'),
    route('authentication', './routes/_auth/webauthn/authentication.ts'),
  ]),
  route('users/:id/avatar', './routes/users/user.$id.avatar.tsx'),
] satisfies RouteConfig;
