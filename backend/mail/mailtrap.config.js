import { MailtrapClient } from "mailtrap";

const TOKEN = "a02c04291f51333f7dc722131bf82ca6";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export  const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Fivo community",
};


