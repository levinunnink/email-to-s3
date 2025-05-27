const postmark = require("postmark");

export const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

