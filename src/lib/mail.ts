import nodemailer from "nodemailer";

const getMailConfig = () => {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT);
  const user = process.env.MAIL_USER;
  const password = process.env.MAIL_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error(
      "Mail configuration is incomplete in .env.local"
    );
  }

  return {
    host,
    port,
    user,
    password,
  };
};

const config = getMailConfig();

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.port === 465,
  auth: {
    user: config.user,
    pass: config.password,
  },
});

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail({
  to,
  subject,
  html,
  text,
}: SendMailOptions): Promise<void> {
  const fromName =
    process.env.MAIL_FROM_NAME ?? "SkillBuilder";

  const fromEmail =
    process.env.MAIL_FROM_EMAIL ??
    "noreply@skillbuilder.local";

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}