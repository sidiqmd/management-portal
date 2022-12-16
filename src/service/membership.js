const db = require("../db/connect");
const axios = require("axios");

module.exports.purchasePremiumMembership = async (req, res) => {
  const { user_id, username, email, full_name, membership } = req.user;
  console.log("purchasePremiumMembership ->", {
    user_id,
    username,
    email,
    full_name,
    membership,
  });

  if (membership === "Premium") {
    return res.status(400).json({
      message: "You are already a premium member",
    });
  }

  const amount = 39.99;

  const payload = {
    collection_id: process.env.BILLPLZ_COLLECTION_CODE,
    email,
    mobile: "",
    name: full_name,
    amount: amount * 100,
    callback_url: `${process.env.BASE_URL}/billplz-callback`,
    description: "Premium Membership Upgrade",
    reference_1_label: "Membership",
    reference_1: "",
    reference_2_label: "",
    reference_2: "",
  };

  const url = `${process.env.BILLPLZ_URL}/bills`;
  const encodeSecretKey = Buffer.from(process.env.BILLPLZ_SECRET_KEY).toString(
    "base64"
  );
  const headers = {
    Authorization: `Basic ${encodeSecretKey}`,
    Accept: "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers });

    console.log("purchasePremiumMembership ->", response.data);

    await db.query(
      "INSERT INTO payment(payment_id, user_id, amount, payment_method, status) VALUES(?,?,?,?,?)",
      [response.data.id, user_id, amount, "Billplz", "In Progress"]
    );
    await db.end();

    return res.status(200).json({
      message: "Please make payment using the payment url",
      paymentUrl: response.data.url,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: "Unable to process payment",
    });
  }
};

module.exports.billplzCallback = async (req, res) => {
  const { id, paid, state } = req.body;
  console.log("billplzCallback ->", id, paid, state);

  const payment = await db.query("SELECT * FROM payment WHERE payment_id = ?", [
    id,
  ]);
  await db.end();

  if (payment.length > 0) {
    await db.query("UPDATE payment SET status = ? WHERE payment_id = ?", [
      state === "paid" ? "Success" : "Failed",
      id,
    ]);
    await db.end();

    if (paid === "true") {
      await db.query("UPDATE user SET membership = ? WHERE user_id = ?", [
        "Premium",
        payment[0].user_id,
      ]);
      await db.end();
    }
  }

  return res.status(200).json({
    message: "Payment status updated",
  });
};
