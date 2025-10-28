import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.js";

async function getUserData(access_token) {
    const response = await fetch(
`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    return data
}

async function checkUserExists(email) {
    const user = await User.find({ email })
    return user
}

export const generateOAuth2URI = async (req,res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    console.log(process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly openid' ,
        prompt: 'consent'
    });

    return res.json({ success: true, body: {url:authorizeUrl} })
}

export const retrieveTokensGoogleOAuth = async (req, res) => {
    try {
        const { code } = req.query

        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing." })
        }

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        const r =  await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);

        const refreshToken = oAuth2Client.credentials.refresh_token
        const accessToken = oAuth2Client.credentials.access_token
        const googleId = oAuth2Client.credentials.id_token

        const { name, email } = await getUserData(
            oAuth2Client.credentials.access_token);

        let user = checkUserExists(email)
        if (user) {
            user = await User.updateOne({ email }, { accessToken, refreshToken })
        } else {
            user = new User({
                googleId,
                name,
                email,
                accessToken,
                refreshToken
            })
            await user.save()
        }

        console.log(user)
        res.redirect(303, `http://localhost:5173/register?accessToken=${accessToken}`);
    } 
    catch (error) {
        res.json({success: false, error })
        throw error
    }
}
