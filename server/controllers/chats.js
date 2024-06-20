import { dummyUsers } from "../sockets/users.js";
import connection from "../db/db.js";


export const getChats = (req, res) => {

    // console.log(dummyUsers.filter( user => user.id !== req.query.id), "dummyUsers");
    const query = 'SELECT * FROM Users';
    const users = dummyUsers.filter(user => user.id.includes('6c84fb90-12c4'));
    console.log(users, "dummyUsers includes");

    return res.json(users);
}


export const getMessages = (req, res) => {
    // console.log("id", req.query)
    const { conversationID } = req.query;
    console.log(conversationID, "conversationId");
    const query = 'SELECT * FROM Messages WHERE conversationID = ?';
    connection.query(query, [conversationID], (err, result) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            console.log('fetched successfully!');
            console.log(result);
            return res.json(result);
        }
    });
    // const messages = dummyMessages.filter(message => (message.senderId === s_id && message.receiverId === r_id) || (message.senderId === r_id && message.receiverId === s_id));
    // console.log(messages, "current chat messages");
    // return res.json(messages);
}


export const postMessage = (req, res) => {
    const { SenderID, conversationID, content, timestamp } = req.body;
    // dummyMessages.push(req.body);
    // console.log(dummyMessages, "dummyMessages");
    // console.log(dummyMessages, "dummyMessages");
    const query = 'INSERT INTO Messages (senderID, conversationID, content, timestamp) VALUES (?, ?, ?, ?)';
    connection.query(query, [SenderID, conversationID, content, timestamp], (err, result) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            console.log(result, 'Message inserted successfully!');
            res.status(200).json({ message: result });
        }
    });
    // return res.json({ message: 'Message sent' });
}


export const createConversation = async (req, res) => {
    // const { senderId, receiverId, message } = req.body;
    const { members, creator, isGroup } = req.body;
    let f = 0;
    console.log(req.body, "members");
    members.push(creator);
    members.sort();
    console.log(members, "members");
    let name = "";
    for (let i = 0; i < members.length; i++) {
        name += members[i] + ",";
    }
    name = name.slice(0, -1);
    if (!isGroup)
        connection.query('SELECT * FROM Conversations WHERE name = ? and isGroup = ? ', [name, isGroup], (err, result) => {
            if (err) {
                console.log(err);
                // throw err;
            }
            else {
                if (result.length > 0) {
                    console.log('Conversation already exists');
                    f = 1
                    return res.json({ conversationId: result[0].id });
                }
                else {
                    connection.query('INSERT INTO Conversations (name) VALUES (?)', [name], async (err, result) => {
                        if (err) {
                            console.log(err);
                            // throw err;
                        }
                        else {
                            const conversationId = result.insertId;
                            // Prepare the base of the INSERT statement
                            let conversations_usersQuery = 'INSERT INTO Conversations_Users (conversationID, userID) VALUES ';
                            // Array to hold the values to be inserted
                            let queryValues = [];
                            // Add placeholders and values for each member
                            // queryValues.push(conversationId, creator);
                            members.forEach(memberId => {
                                conversations_usersQuery += '(?, ?),';
                                queryValues.push(conversationId, memberId);
                            });
                            // Remove the trailing comma
                            conversations_usersQuery = conversations_usersQuery.slice(0, -1);
                            // Execute the query
                            connection.query(conversations_usersQuery, queryValues, (err, result) => {
                                if (err) {
                                    console.log('Error inserting conversation users:', err.message);
                                    res.status(500).json({ error: "Error adding members to conversation" });
                                } else {
                                    console.log('Conversation_Users inserted successfully!');
                                    res.json({ message: 'Conversation created', conversationId: conversationId });
                                }
                            });
                        }
                    }
                    );
                }
            }
        }
        );
    // if (f === 0)

    // const query = 'INSERT INTO Conversations (name) VALUES (?)';
    // connection.query(query, [senderId + "," + receiverId], (err, result) => {
    //     if (err) {
    //         console.log('conversation already exists, so not adding to db');
    //         // throw err;
    //     }
    //     else {
    //         const conversationId = result.insertId;
    //         const messageQuery = 'INSERT INTO Messages (senderId, receiverId, content, conversationID) VALUES (?, ?, ?, ?)';
    //         connection.query(messageQuery, [senderId, receiverId, message, conversationId], (err, result) => {
    //             if (err) {
    //                 console.log('message already exists, so not adding to db');
    //                 // throw err;
    //             }
    //             else {
    //                 const newMessageId = result.insertId;
    //                 const conversations_usersQuery = 'INSERT INTO Conversations_Users (conversationID, userID, lastmessageID) VALUES (?, ?) , (?, ?)';
    //                 connection.query(conversations_usersQuery, [conversationId, senderId, conversationId, receiverId], (err, result) => {
    //                     if (err) {
    //                         console.log('conversation already exists, so not adding to db');
    //                         // throw err;
    //                     }
    //                     else
    //                         console.log('Conversation_Users inserted successfully!');
    //                 });
    //                 console.log('Message inserted successfully!');
    //             }
    //         });
    //         console.log('Conversation inserted successfully!');
    //     }
    // });
    // return res.json({ message: 'Conversation created' });
}


export const getConversation = async (req, res) => {

    const { conversationId, userId } = req.query;
    console.log(req.query, "userId");
    const query = `
SELECT 
    users.username,
    conversations_users.userid AS userID,
    conversations_users.JoinedTime,
    conversations_users.lefttime,
    conversations_users.lastmessageID,
    conversations_users.conversationid AS conversationID,
    messages.content,
    messages.timestamp,
    messages.readstatus
FROM 
   ( SELECT * from conversations_users where conversationid = ?) as conversations_users
JOIN users ON users.id = conversations_users.userid
LEFT JOIN messages
ON messages.id = conversations_users.lastmessageID
WHERE conversations_users.userid != ?`;

// SELECT 
//     users.username,
//     conversations_users.userid AS userID,
//     conversations_users.JoinedTime,
//     conversations_users.lefttime,
//     conversations_users.lastmessageID,
//     conversations_users.conversationid AS conversationID,
//     messages.content,
//     messages.timestamp,
//     messages.readstatus
// FROM 
//    ( SELECT * from conversations_users where conversationid = 2) as conversations_users
// JOIN users ON users.id = conversations_users.userid
// LEFT JOIN messages
// ON messages.id = conversations_users.lastmessageID
// WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a'


// SELECT 
//     users.username,
//     conversations_users.userid AS userID,
//     conversations_users.JoinedTime,
//     conversations_users.lefttime,
//     conversations_users.lastmessageID,
//     conversations_users.conversationid AS conversationID
    
// FROM 
//    ( SELECT * from conversations_users where conversationid = 2) as conversations_users
// JOIN users ON users.id = conversations_users.userid
// WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a'

    connection.query(query, [conversationId, userId], (err, result) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            console.log('fetched successfully!');
            console.log(result);
            return res.json(result);
        }
    });

}


export const getConversations = async (req, res) => {

    const { userId } = req.query;
    console.log(req.query, "userId");
    const query = `
SELECT 
    users.username,
    conversations_users.userid AS userID,
    conversations_users.JoinedTime,
    conversations_users.lefttime,
    conversations_users.lastmessageID,
    convos.conversationid AS conversationID,
    messages.content,
    messages.timestamp,
    messages.readstatus
FROM 
    conversations_users
JOIN (
    SELECT conversationid
    FROM conversations_users
    WHERE userid = ?
) AS convos
ON convos.conversationid = conversations_users.conversationid
JOIN users
ON users.id = conversations_users.userid
JOIN messages
ON messages.id = conversations_users.lastmessageID
WHERE conversations_users.userid != ?
`;

    // SELECT 
    //     users.username,
    //     conversations_users.userid AS userID,
    //     conversations_users.JoinedTime,
    //     conversations_users.lefttime,
    //     conversations_users.lastmessageID,
    //     convos.conversationid AS conversationID
    // FROM 
    //     conversations_users
    // JOIN (
    //     SELECT conversationid
    //     FROM conversations_users
    //     WHERE userid = 'd4ecc029-a88a-40ac-acc8-4b380955225a'
    // ) AS convos
    // ON convos.conversationid = conversations_users.conversationid
    // JOIN users
    // ON users.id = conversations_users.userid where userid ='fa48516e-6179-4647-962d-3a82eaeb7b41'
    // JOIN messages
    // ON messages.id = conversations_users.lastmessageID
    // WHERE conversations_users.userid != 'd4ecc029-a88a-40ac-acc8-4b380955225a';




    // const query = 'SELECT * FROM Conversations';
    connection.query(query, [userId, userId], (err, result) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            console.log('Conversation inserted successfully!');
            console.log('fetched successfully!');
            console.log(result);
            return res.json(result);
        }
    });
    // return res.json({ message: 'Conversation created' });
}


export const getUsers = async (req, res) => {
    const { search } = req.query;
    const query = 'SELECT * FROM Users WHERE username like ?';
    connection.query(query, [`%${search}%`], (err, result) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            console.log('fetched successfully!');
            console.log(result);
            return res.json(result);
        }
    });

    // return res.json({ message: 'Conversation created' });
}