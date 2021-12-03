import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const RoomCreatedModal = function (props) {
  const { isOpen, onClose, generatedRoomId } = props;

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New room is created successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Your new room id is <strong>{generatedRoomId}</strong>. Click on{" "}
            <strong>Save</strong> to copy id into room-id field.
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RoomCreatedModal;
