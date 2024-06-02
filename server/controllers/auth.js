import queryString from 'query-string'
import googleConfig from '../constants.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { dummyUsers } from '../sockets/users.js';
const loggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        // console.log(JSON.stringify(req.cookies.token), "token")
        if (!token) {
            res.json({ loggedIn: false });
            return;
        }
        const { user } = jwt.verify(token, googleConfig.tokenSecret);
        const newToken = jwt.sign({ user }, googleConfig.tokenSecret, { expiresIn: googleConfig.tokenExpiration });
        // const user = { email, name, picture, id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a" + Math.floor(Math.random() * 1000) };
        const newUser = {
            id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a" + (user.email.substring(0,1) === 'm' ? '1' : '2'),
            name: user.name,
            email:user.email,
            subject: "Meeting Tomorrow",
            text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
            date: "2023-10-22T09:00:00",
            read: true,
            labels: ["meeting", "work", "important"],
        };
        const users = dummyUsers.filter(user => user.email === newUser.email);
        if (users.length === 0) dummyUsers.push(newUser);
        res.cookie('token', newToken, {
            maxAge: googleConfig.tokenExpiration,
            // encode: String,
            // path: '/',
            httpOnly: true,
            // secure: true
        });
        res.json({ loggedIn: true, user:{...user,id:newUser.id} });
    }
    catch (err) {
        res.json({ loggedIn: false });
    }
}

const url = (req, res) => {
    const params = queryString.stringify({
        client_id: googleConfig.clientId,
        redirect_uri: googleConfig.redirectUrl,
        response_type: 'code',
        scope: 'email profile openid',
        state: 'oauth_google'
    });
    // console.log(googleConfig, "googleConfig")
    // console.log(params, "params")
    res.json({ url: googleConfig.authUrl + '?' + params });
}

const token = async (req, res) => {
    const code = req.query.code;
    // console.log(req.query, "exchange params")
    if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
    const params = queryString.stringify({
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: googleConfig.redirectUrl,
    });
    // console.log(params, "exchange params")
    try {
        // console.log(`${googleConfig.tokenUrl}?${params}`, "tokenUrl")
        const {
            data: { id_token },
        } = await axios.post(`${googleConfig.tokenUrl}?${params}`)
        // console.log(id_token, "id_token");
        const { email, name, picture } = jwt.decode(id_token);
        const user = { email, name, picture, id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a"+ (email.substring(0,1) === 'm' ? '1' : '2')};
        const newUser = {
            id: user.id,
            name,
            email,
            subject: "Meeting Tomorrow",
            text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
            date: "2023-10-22T09:00:00",
            read: true,
            labels: ["meeting", "work", "important"],
        };
        const users = dummyUsers.filter(user => user.email === user.email);
        if (users.length === 0) dummyUsers.push(newUser);
        // dummyUsers.push(newUser);
        // console.log(newUser, "dummyUsers");
        console.log(user, "user");
        const token = jwt.sign({ user }, googleConfig.tokenSecret, { expiresIn: googleConfig.tokenExpiration });
        // console.log((token), "token client side");
        res.cookie('token', token
            , {
                maxAge: googleConfig.tokenExpiration,
                httpOnly: true,
                // encode: String,
                // path: '/',
                // secure: true
            }
        ).json({ token: token, user });
        // res.json({token:token, user });
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to exchange code for token', error: err });
    }
}

const logout = (req, res) => {
    res.clearCookie('token', {
        // maxAge: googleConfig.tokenExpiration,
        httpOnly: true,
        // path: '/',
        // encode: String,
        // secure: true
    }).json({ message: 'Logged out' });
}

export { loggedIn, url, token, logout }