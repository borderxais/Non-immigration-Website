import React from 'react';
import { Button, Row, Col } from 'antd';

interface FormItemButtonsProps {
  onAdd: () => void;
  onRemove: () => void;
  addText?: string;
  removeText?: string;
  showRemove?: boolean;
}

/**
 * FormItemButtons - Reusable component for add/remove buttons in Form.List items
 */
const FormItemButtons: React.FC<FormItemButtonsProps> = ({
  onAdd,
  onRemove,
  addText = "增加另一个",
  removeText = "移除",
  showRemove = true
}) => {
  return (
    <Row>
      <Col span={24}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button type="link" onClick={onAdd} style={{ marginRight: '8px' }}>{addText}</Button>
          {showRemove && (
            <Button type="link" danger onClick={onRemove}>{removeText}</Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default FormItemButtons;
