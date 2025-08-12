import { getFormProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { User, UserImage } from '@prisma/client';
import {
  Button,
  Drawer,
  DrawerActions,
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  ErrorMessage,
  Field,
  ImageUploader,
  ImageUploaderRef,
  Input,
  Label,
} from '@~~_starter.name_~~/ui';
import { useRef } from 'react';
import { FetcherWithComponents } from 'react-router';
import z from 'zod';
import { getUserImgSrc } from '../utils/misc';

export const UserSchema = z.object({
  id: z.string(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  name: z.string({ required_error: 'Full name is required' }),
  image: z
    .object({
      id: z.string(),
      altText: z.string().optional(),
      objectKey: z.string(),
    })
    .nullable(),
});

interface UserDrawerProps {
  user?: User & { image: UserImage | null };
  isOpen: boolean;
  fetcher: FetcherWithComponents<
    | {
        result: SubmissionResult<string[]>;
      }
    | {
        result: SubmissionResult<string[]>;
      }
  >;
  onClose: (value: boolean) => void;
  onSave: () => void;
}

export const UserDrawer = ({
  user,
  isOpen,
  fetcher,
  onClose,
  onSave,
}: UserDrawerProps) => {
  const uploaderRef = useRef<ImageUploaderRef>(null);

  const [form, fields] = useForm({
    id: user?.id ? `edit-user-${user.id}` : 'new-user',
    constraint: getZodConstraint(UserSchema),
    defaultValue: user,
    lastResult: fetcher.data?.result,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: UserSchema,
      });
    },
  });

  const { onSubmit, ...formProps } = getFormProps(form);

  return (
    <Drawer preventCloseOnOutsideClick open={isOpen} close={onClose}>
      <fetcher.Form
        method="POST"
        className="flex flex-col gap-8"
        {...formProps}
        onSubmit={(e) => {
          onSubmit(e);
          onSave();
        }}
      >
        <DrawerHeader>
          <DrawerTitle>{`${user ? 'Edit' : 'New'} user`}</DrawerTitle>
          <DrawerDescription>
            {user ? (
              <>
                Edit the details of the user{' '}
                <span className="font-bold">{user.name}</span>.
              </>
            ) : (
              <>Add a new user.</>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-8">
          <input type="hidden" name={fields.id.name} value={fields.id.value} />
          <ImageUploader
            ref={uploaderRef}
            name={fields.image.name}
            initialImageUrl={getUserImgSrc(user?.image?.objectKey)}
          />
          <Field>
            <Label>Email</Label>
            <Input
              name={fields.email.name}
              placeholder="john.doe@example.com"
              defaultValue={fields.email.value}
              required
              autoFocus
            />
            {fields.email.errors ? (
              <ErrorMessage>{fields.email.errors}</ErrorMessage>
            ) : null}
          </Field>
          <Field>
            <Label>Name</Label>
            <Input
              name={fields.name.name}
              placeholder="John Doe"
              defaultValue={fields.name.value}
              required
            />
            {fields.name.errors ? (
              <ErrorMessage>{fields.name.errors}</ErrorMessage>
            ) : null}
          </Field>
        </DrawerBody>
        <DrawerActions>
          <Button type="submit">Save</Button>
          <Button plain onClick={() => onClose(false)}>
            Cancel
          </Button>
        </DrawerActions>
      </fetcher.Form>
    </Drawer>
  );
};
