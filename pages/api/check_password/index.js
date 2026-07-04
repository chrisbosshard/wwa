export default async function handler(req, res) {
  const password = req?.body?.password ?? "";
  if (password === process.env.NEXT_PASSWORD_ADMIN) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
}
