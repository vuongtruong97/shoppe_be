const { google } = require('googleapis')
const { Readable } = require('stream')

const {
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_SECRET,
    GOOGLE_DRIVE_REDIRECT_URI,
    GOOGLE_DRIVE_REFRESH_TOKEN,
} = process.env

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_SECRET,
    GOOGLE_DRIVE_REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
})

const that = (module.exports = {
    async setFilePublic(fileId) {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            })
            return await drive.files.get({
                fileId,
                fields: 'webViewLink,webContentLink',
            })
        } catch (error) {
            console.log(error)
        }
    },
    async upLoadFile(file) {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mime: file.mimetype,
                },
                media: {
                    mimeType: file.mimetype,
                    body: Readable.from(file.buffer),
                },
            })
            const fileId = createFile.data.id

            const urls = await that.setFilePublic(fileId)

            return urls.data.webViewLink
        } catch (error) {
            console.log(error)
        }
    },
    deleteFile() {},
})
