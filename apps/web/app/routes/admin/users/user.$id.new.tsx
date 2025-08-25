import { ActionFunctionArgs } from 'react-router';
import UserNew, { action as userNewAction } from './user.new';

export async function action(args: ActionFunctionArgs) {
  return userNewAction(args);
}

export default UserNew;
