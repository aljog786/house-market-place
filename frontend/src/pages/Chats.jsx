import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Image } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { useGetChatsQuery } from '../slices/chatsApiSlice';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { BASE_URL } from '../constants';

const socket = io(BASE_URL);

const Chats = () => {
  const { data: chats = [], isLoading, error } = useGetChatsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      const filteredMessages = selectedChat.messages.filter(
        (msg) => msg.sender._id === userInfo._id || msg.receiver._id === userInfo._id
      );
      setMessages(filteredMessages);
      socket.emit('joinRoom', selectedChat._id);
  
      socket.on('message', (message) => {
        if (message.room === selectedChat._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => {
      socket.off('message');
    };
  }, [selectedChat, userInfo._id]);  

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      sender: userInfo._id,
      receiver:
        selectedChat.messages.length > 0
          ? selectedChat.messages[0].sender._id === userInfo._id
            ? selectedChat.messages[0].receiver
            : selectedChat.messages[0].sender
          : { name: 'Other User' },
      text: newMessage,
      time: new Date().toISOString(),
      room: selectedChat._id,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    socket.emit('sendMessage', message);
  };

  if (isLoading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats!</p>;

  const chatList = chats.map((chat) => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const otherName =
      lastMsg && lastMsg.sender._id === userInfo._id
        ? lastMsg.receiver.name
        : lastMsg.sender.name;
    return {
      id: chat._id,
      name: otherName,
      lastMessage: lastMsg ? lastMsg.text : 'No messages yet',
      entireChat: chat,
    };
  });

  return (
    <Container fluid className="py-4" style={{ height: '100vh' }}>
      <Row className="h-100">
        <Col md={3} className="border-end p-0 bg-light">
          <Card className="h-100 border-0">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">INBOX</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {chatList.map((chatItem) => (
                  <ListGroup.Item
                    key={chatItem.id}
                    action
                    onClick={() => handleSelectChat(chatItem.entireChat)}
                    className="d-flex align-items-center"
                  >
                    <Image
                      src="https://via.placeholder.com/40"
                      roundedCircle
                      className="me-2"
                    />
                    <div>
                      <strong>{chatItem.name}</strong>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.9em' }}>
                        {chatItem.lastMessage}
                      </p>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9} className="d-flex flex-column p-0">
          {!selectedChat ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <p>Select a chat to view conversation</p>
            </div>
          ) : (
            <>
              <Card className="border-0 rounded-0">
                <Card.Header className="bg-white border-bottom d-flex align-items-center">
                  <Image
                    src="https://via.placeholder.com/40"
                    roundedCircle
                    className="me-2"
                  />
                  <div className="d-flex flex-column">
                    <strong>
                      {selectedChat.messages.length > 0 &&
                      selectedChat.messages[0].sender._id === userInfo._id
                        ? selectedChat.messages[0].receiver.name
                        : selectedChat.messages[0].sender.name}
                    </strong>
                    <small className="text-muted">
                      {selectedChat.building?.name} - ₹{selectedChat.building?.regularPrice}
                    </small>
                  </div>
                </Card.Header>
              </Card>

              <div
                className="flex-grow-1 p-3"
                style={{ overflowY: 'auto', backgroundColor: '#f9f9f9' }}
              >
                <ListGroup variant="flush">
                  {messages.map((msg, index) => {
                    const isSender = msg.sender._id === userInfo._id;
                    return (
                      <ListGroup.Item
                        key={index}
                        className={`d-flex ${isSender ? 'justify-content-end' : 'justify-content-start'}`}
                        style={{ border: 'none', backgroundColor: 'transparent' }}
                      >
                        <div className="d-flex flex-column">
                          <small className="text-muted" style={{ fontSize: '0.8em' }}>
                            {isSender ? 'You' : msg.sender.name}
                          </small>
                          <div
                            className={`p-2 rounded ${isSender ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                            style={{ maxWidth: '100%' }}
                          >
                            {msg.text}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.7em' }}>
                            {new Date(msg.time).toLocaleTimeString()}
                          </small>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>

              <Card className="border-0 rounded-0 mb-4">
                <Card.Body className="p-2">
                  <Form onSubmit={handleSendMessage} className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="me-2"
                    />
                    <Button variant="primary" type="submit">
                      <FaPaperPlane />
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chats;
