import { css } from '@emotion/css';
import { StandardEditorProps } from '@grafana/data';
import { Button, ColorPicker, Icon, Input, useTheme2 } from '@grafana/ui';
import React, { FormEvent } from 'react';

interface ColorMapping {
  text: string;
  color: string;
}

interface Settings {}

interface Props extends StandardEditorProps<ColorMapping[], Settings> {}

export const ColorEditor = ({ value, onChange }: Props) => {
  const theme = useTheme2().v1;

  const colors = value || [];

  const onTextChange = (index: number) => (event: FormEvent<HTMLInputElement>) => {
    onChange(value.map((v, i) => (i === index ? { ...v, text: event.currentTarget.value } : v)));
  };
  const onColorChange = (index: number) => (color: string) => {
    onChange(value.map((v, i) => (i === index ? { ...v, color } : v)));
  };
  const addColor = () => {
    onChange([...colors, { text: '', color: 'green' }]);
  };
  const onRemoveColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        icon="plus"
        fullWidth
        className={css`
          width: 100%;
          margin-bottom: ${theme.spacing.sm};
        `}
        onClick={() => addColor()}
      >
        Add color mapping
      </Button>
      <div>
        {colors.map(({ text, color }, i) => {
          return (
            <Input
              key={i}
              type="text"
              className={css`
                &:not(&:last-child) {
                  margin-bottom: ${theme.spacing.sm};
                }
              `}
              prefix={
                <div
                  className={css`
                    padding: 0 ${theme.spacing.sm};
                  `}
                >
                  <ColorPicker color={color} onChange={onColorChange(i)} />
                </div>
              }
              value={text}
              onChange={onTextChange(i)}
              suffix={
                <Icon
                  className={css`
                    color: ${theme.colors.textWeak};
                    cursor: pointer;

                    &:hover {
                      color: ${theme.colors.text};
                    }
                  `}
                  name="trash-alt"
                  onClick={() => onRemoveColor(i)}
                />
              }
            />
          );
        })}
      </div>
    </>
  );
};

