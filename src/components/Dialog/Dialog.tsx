import React, {useEffect} from 'react';
import {Overlay, ContentBackground, Close} from './Dialog.sc';
import {DialogProps} from './types';

export const Dialog: React.FC<DialogProps> = ({onClose, children}) => {
  const onMouseDown = (event: React.MouseEvent) => {
    // ignore clicks on children
    if (event.target !== event.currentTarget) return;
    onClose();
  };

  const setBodyOverflow = (overflow: string) => {
    document.body.style.overflow = overflow;
  };

  useEffect(() => {
    setBodyOverflow('hidden');
    return () => {
      setBodyOverflow('unset');
    };
  });

  return (
    <Overlay onMouseDown={onMouseDown}>
      <ContentBackground>
        <Close onClick={() => onClose()}>
          <svg viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </Close>
        {children}
      </ContentBackground>
    </Overlay>
  );
};
