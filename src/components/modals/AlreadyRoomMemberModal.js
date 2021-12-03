import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const AlreadyRoomMemberModal = function (props) {
  const { isOpen, onClose } = props;

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>can not join</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            you are already a member of this room because you may have created or joined this room before. please go to messenger
            section
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} colorScheme="blue" mr={3}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlreadyRoomMemberModal;
