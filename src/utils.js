const jwt = require('jsonwebtoken')
const APP_SECRET = 'TestAppSecret@@333'

function getUserId(context) {
    const auth = context.request.get('Authorization')
    if(auth) {
        const token = auth.replace('Bearer ', '')
        const {userId} = jwt.verify(token, APP_SECRET)
        return userId
    }

    throw new Error('Not authenticated')
}

module.exports = {APP_SECRET, getUserId}