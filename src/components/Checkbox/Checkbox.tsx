import React, {forwardRef} from 'react';
import {CheckboxProps} from './types';
import {
  Container,
  Label,
  Description,
  Errors,
  OptionContainer,
  OptionLabel,
} from './Checkbox.sc';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {label, description, options, errors = [], value, defaultValue, ...props},
    ref,
  ) => {
    const _errors = errors.map((error, idx) => (
      <span key={idx}>• {error}</span>
    ));

    return (
      <Container>
        <Label htmlFor={props.name} error={!!errors.length}>
          {label}
          {props.required && '*'}
        </Label>
        <Description error={!!errors.length}>{description}</Description>
        {options.map(({label, value: optionVal}, index) => {
          const checked = {} as any;
          if (defaultValue?.includes(optionVal)) checked.defaultChecked = true;
          else if (value?.includes(optionVal)) checked.checked = true;
          return (
            <OptionContainer key={index}>
              <input
                {...props}
                type="checkbox"
                value={optionVal}
                {...checked}
                style={{marginTop: '3.5px'}} // to align with text
                ref={ref}
              />
              <OptionLabel>{label}</OptionLabel>
            </OptionContainer>
          );
        })}
        <Errors>{_errors}</Errors>
      </Container>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export {Checkbox};
