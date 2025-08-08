import {
  Button,
  GridLayout,
  GridLayoutItem,
  Heading,
  PageHeader,
  Text,
} from '@~~_starter.name_~~/ui';
import { useUser } from '../../utils/user';

export const Profile = () => {
  const user = useUser();

  return (
    <>
      <PageHeader label="My profile" />
      <GridLayout>
        <GridLayoutItem>
          <div className="mx-auto grid w-full max-w-sm grid-cols-1 gap-8">
            <header>
              <Heading level={2}>{user.name}</Heading>
              <Text>{user.email}</Text>
            </header>
            <Button href="/profile/edit">Edit profile</Button>
          </div>
        </GridLayoutItem>
      </GridLayout>
    </>
  );
};

export default Profile;
