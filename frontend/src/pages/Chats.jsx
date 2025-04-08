import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Image } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { useGetChatsQuery } from '../slices/chatsApiSlice';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { BASE_URL } from '../constants';

const socket = io(BASE_URL);

const Chats = () => {
  const location = useLocation();
  const { chat: incomingChat } = location.state || {}; 
  const { data: chats = [], isLoading, error } = useGetChatsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!isLoading && incomingChat) {
      const found = chats.find((c) => c._id === incomingChat._id);
      if (found) {
        setSelectedChat(found);
        setMessages(found.messages);
      } else {
        setSelectedChat(incomingChat);
        setMessages(incomingChat.messages || []);
      }
    }
  }, [incomingChat, chats, isLoading]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinRoom', selectedChat._id);

      socket.on('message', (message) => {
        if (message.chatId === selectedChat._id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socket.on('previousMessages', (msgs) => {
        setMessages(msgs);
      });
    }
    return () => {
      socket.off('message');
      socket.off('previousMessages');
    };
  }, [selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      chatId: selectedChat._id,
      sender: userInfo._id,
      receiver: selectedChat.participants.find((p) => p._id !== userInfo._id)?._id,
      text: newMessage,
      time: new Date().toISOString()
    };
    setMessages([...messages, { ...message, sender: { _id: userInfo._id, name: 'You' } }]);
    setNewMessage('');
    socket.emit('sendMessage', message);
  };

  if (isLoading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats!</p>;

  const chatList = chats.map((chat) => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const otherParticipant = chat.participants.find((p) => p._id !== userInfo._id);
    const otherName = otherParticipant?.name || 'Unknown';
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
                      {selectedChat.participants
                        .filter((p) => p._id !== userInfo._id)
                        .map((p) => p.name)
                        .join(', ') || 'No other user'}
                    </strong>
                    {selectedChat.building && (
                      <small className="text-muted">
                        {selectedChat.building.name} - ₹
                        {selectedChat.building.regularPrice}
                      </small>
                    )}
                  </div>
                </Card.Header>
              </Card>

              <div
                className="flex-grow-1 p-3"
                style={{ overflowY: 'auto', backgroundColor: '#f9f9f9' }}
              >
                <ListGroup variant="flush">
                  {messages.map((msg, index) => {
                    const senderId =
                      typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    const isSender = senderId === userInfo._id;
                    const senderName =
                      typeof msg.sender === 'object'
                        ? msg.sender.name
                        : 'Other User';

                    return (
                      <ListGroup.Item
                        key={index}
                        className={`d-flex ${
                          isSender ? 'justify-content-end' : 'justify-content-start'
                        }`}
                        style={{ border: 'none', backgroundColor: 'transparent' }}
                      >
                        <div className="d-flex flex-column">
                          <small className="text-muted" style={{ fontSize: '0.8em' }}>
                            {isSender ? 'You' : senderName}
                          </small>
                          <div
                            className={`p-2 rounded ${
                              isSender ? 'bg-primary text-white' : 'bg-light text-dark'
                            }`}
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
