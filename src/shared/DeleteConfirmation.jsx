import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmation = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button id={props.id} style={{ display: 'none'}} onClick={toggle}>Lable</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Delete Confirmation</ModalHeader>
        <ModalBody style={{ textAlign: 'center'}}>
          Are you sure, you want to delete ?
        </ModalBody>
        <ModalFooter>
        <Button color="secondary" onClick={toggle}>No</Button>{' '}
        <Button color="primary" onClick={() => {props.confirm(); toggle()}}>Yes</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default DeleteConfirmation;