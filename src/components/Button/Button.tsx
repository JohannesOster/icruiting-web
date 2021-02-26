import React, {MouseEvent} from 'react';
import {useTheme} from 'styled-components';
import {ButtonProps} from './types';
import {BaseButton, LoadingSpinnerContainer} from './Button.sc';
import {Spinner} from '../Spinner';

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const {colors} = useTheme();

  const _onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    onClick && onClick(event);
  };

  return (
    <BaseButton
      isLoading={isLoading}
      disabled={disabled}
      onClick={_onClick}
      type={type}
      {...props}
    >
      <span style={isLoading ? {opacity: 0, height: 0} : {}}>{children}</span>
      {isLoading && (
        <LoadingSpinnerContainer>
          <Spinner
            {...(disabled
              ? {}
              : {
                  foreground: colors.buttonLoadingSpinnerForeground,
                  background: colors.buttonLoadingSpinnerBackground,
                })}
          />
        </LoadingSpinnerContainer>
      )}
    </BaseButton>
  );
};
