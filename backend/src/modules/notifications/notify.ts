import { sms } from "../../providers/sms";
import { User } from "../users/user.model";
import { Notification } from "./notification.model";

/** Single place every module uses to tell someone something. Always stores an in-app copy; SMS is optional. */
export async function notify(userId: string, title: string, body: string, opts: { sms?: boolean } = {}) {
  await Notification.create({ userId, title, body, channel: "in_app" });
  if (opts.sms) {
    const user = await User.findById(userId);
    if (user?.phone) await sms().send(user.phone, `${title}: ${body}`).catch((e) => console.error("[notify] sms failed", e));
  }
}

/** Notify every user who belongs to a vendor (e.g. the seller's owner and staff). */
export async function notifyVendor(vendorId: string, title: string, body: string) {
  const users = await User.find({ vendorId }).select("_id");
  await Promise.all(users.map((u) => notify(String(u._id), title, body)));
}
