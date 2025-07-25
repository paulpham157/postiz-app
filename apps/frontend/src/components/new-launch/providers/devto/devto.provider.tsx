'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { DevToSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/dev.to.settings.dto';
import { Input } from '@gitroom/react/form/input';
import { MediaComponent } from '@gitroom/frontend/components/media/media.component';
import { SelectOrganization } from '@gitroom/frontend/components/new-launch/providers/devto/select.organization';
import { DevtoTags } from '@gitroom/frontend/components/new-launch/providers/devto/devto.tags';
import { useMediaDirectory } from '@gitroom/react/helpers/use.media.directory';
import clsx from 'clsx';
import MDEditor from '@uiw/react-md-editor';
import { Canonical } from '@gitroom/react/form/canonical';
import { useIntegration } from '@gitroom/frontend/components/launches/helpers/use.integration';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';

const DevtoPreview: FC = () => {
  const { value } = useIntegration();
  const settings = useSettings();
  const image = useMediaDirectory();
  const [coverPicture, title, tags] = settings.watch([
    'main_image',
    'title',
    'tags',
  ]);
  return (
    <div
      className={clsx(
        'font-[800] flex h-[1000px] w-[699.8px] rounded-[10px] bg-customColor32 overflow-hidden overflow-y-auto flex-col gap-[32px]'
      )}
    >
      {!!coverPicture?.path && (
        <div className="h-[338.672px]">
          <img
            className="object-cover w-full h-full"
            src={image.set(coverPicture.path)}
            alt="cover_picture"
          />
        </div>
      )}
      <div className="px-[60px]">
        <div className="text-[48px] leading-[60px] mb-[8px]">{title}</div>
        <div className="flex gap-[16px]">
          {tags?.map((p: any) => (
            <div key={p.label}>#{p.label}</div>
          ))}
        </div>
      </div>
      <div className="px-[60px]">
        <MDEditor.Markdown
          style={{
            whiteSpace: 'pre-wrap',
          }}
          skipHtml={true}
          source={value.map((p) => p.content).join('\n')}
        />
      </div>
    </div>
  );
};
const DevtoSettings: FC = () => {
  const form = useSettings();
  const { date } = useIntegration();
  return (
    <>
      <Input label="Title" {...form.register('title')} />
      <Canonical
        date={date}
        label="Canonical Link"
        {...form.register('canonical')}
      />
      <MediaComponent
        label="Cover picture"
        description="Add a cover picture"
        {...form.register('main_image')}
      />
      <div className="mt-[20px]">
        <SelectOrganization {...form.register('organization')} />
      </div>
      <div>
        <DevtoTags label="Tags (Maximum 4)" {...form.register('tags')} />
      </div>
    </>
  );
};
export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  SettingsComponent: DevtoSettings,
  CustomPreviewComponent: undefined, // DevtoPreview,
  dto: DevToSettingsDto,
  checkValidity: undefined,
  maximumCharacters: 100000,
});
