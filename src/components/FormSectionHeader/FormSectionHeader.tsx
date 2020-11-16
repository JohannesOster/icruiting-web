import React, {FC} from 'react';
import {H6, Typography} from 'components';

interface Props {
  label: string;
  description?: string;
}

export const FormSectionHeader: FC<Props> = ({label, description}) => {
  return (
    <div>
      <H6>{label}</H6>
      {description && <Typography kind="secondary">{description}</Typography>}
    </div>
  );
};
