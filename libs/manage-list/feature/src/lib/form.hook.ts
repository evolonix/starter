import { DefaultValue, useForm as useConformForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Entity } from './models';

export const useForm = <T extends Entity>(
  id: string,
  defaultValue: DefaultValue<T> | undefined,
  schema: z.ZodType<T>,
  onSubmit?: (entity: T) => Promise<void>,
) => {
  return useConformForm<T>({
    id: `${id}-form-${defaultValue?.id ?? 'new'}`,
    defaultValue,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      const errors = parseWithZod(formData, {
        schema,
      });

      return errors;
    },
    onSubmit: onSubmit
      ? (e, { formData }) => {
          e.preventDefault();

          const submission = parseWithZod(formData, {
            schema,
          });

          if (submission.status === 'success') {
            console.log('Form submitted:', submission.value);
            onSubmit({ ...defaultValue, ...submission.value } as T);
          }
          if (submission.status === 'error') {
            console.error('Form error:', submission.error);
            submission.reply();
          }
        }
      : undefined,
  });
};
