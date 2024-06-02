import Express from 'express';
import cookieParser from 'cookie-parser';
import { getChats, getMessages, postMessage } from '../controllers/chats.js';
Express().use(cookieParser())
const chatsRouter = Express.Router();
// dotenv.googleConfig();
chatsRouter.get('/chats', getChats)
chatsRouter.get('/messages', getMessages);

chatsRouter.post('/message', postMessage);

// chatsRouter.post('/logout', logout);

export default chatsRouter;