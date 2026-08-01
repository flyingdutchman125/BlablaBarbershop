const db = require("../config/db");
const crypto = require("crypto");

exports.createTransaction = async (req, res) => {
  try {
    const {
      reservation_id,
      items,
      total_amount,
      payment_method,
      amount_paid,
      member_phone,
      points_used,
      queue_number,
      kapster_id,
    } = req.body;

    // Receipt number e.g. TRX-XXXXX
    const receipt_number =
      "TRX-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const cashier_id = req.user.id; // From verifyToken middleware
    const change_amount = amount_paid - total_amount;

    await db.query("BEGIN");

    // Handle Member Points and Discounts
    let memberId = null;
    let newPoints = 0;

    if (member_phone) {
      const [members] = await db.query(
        "SELECT * FROM members WHERE phone = ?",
        [member_phone],
      );
      if (members.length > 0) {
        const member = members[0];
        memberId = member.id;

        if (points_used && points_used > 0) {
          if (member.points < points_used) {
            await db.query("ROLLBACK");
            return res.status(400).json({ message: "Insufficient points" });
          }
          // Deduct points
          await db.query(
            "UPDATE members SET points = points - ? WHERE id = ?",
            [points_used, memberId],
          );
        }

        // Calculate earned points from items
        const itemsList = items || [];
        for (const item of itemsList) {
          if (item.type !== "product") {
            if (item.name && item.name.toLowerCase().includes("casual"))
              newPoints += 5 * item.qty;
            if (item.name && item.name.toLowerCase().includes("clean"))
              newPoints += 10 * item.qty;
            if (item.name && item.name.toLowerCase().includes("grooming"))
              newPoints += 20 * item.qty;
          }
        }

        // Check birthday bonus
        if (member.birth_date) {
          const jakartaTime = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
          );
          let bMonth, bDay;
          if (typeof member.birth_date === "string") {
            const parts = member.birth_date.split("T")[0].split("-");
            bMonth = parseInt(parts[1], 10) - 1;
            bDay = parseInt(parts[2], 10);
          } else if (member.birth_date instanceof Date) {
            bMonth = member.birth_date.getMonth();
            bDay = member.birth_date.getDate();
          }

          if (
            bMonth !== undefined &&
            jakartaTime.getMonth() === bMonth &&
            jakartaTime.getDate() === bDay
          ) {
            newPoints += 50;
          }
        }

        if (newPoints > 0) {
          await db.query(
            "UPDATE members SET points = points + ? WHERE id = ?",
            [newPoints, memberId],
          );
        }
      }
    }

    const [result] = await db.query(
      "INSERT INTO transactions (receipt_number, reservation_id, cashier_id, kapster_id, total_amount, payment_method, amount_paid, change_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        receipt_number,
        reservation_id || null,
        cashier_id,
        kapster_id || null,
        total_amount,
        payment_method,
        amount_paid,
        change_amount,
      ],
    );

    const newTransactionId = result.insertId;

    if (reservation_id) {
      await db.query(
        "UPDATE reservations SET status = 'completed', transaction_id = ? WHERE id = ?",
        [newTransactionId, reservation_id],
      );
    }

    // Handle walk-in items to appear in reservations table for Admin Dashboard
    let itemsToCreate = JSON.parse(JSON.stringify(items || []));

    // If it started as a reservation, decrement one item's qty so we don't duplicate the booked one
    if (reservation_id) {
      const [resRows] = await db.query(
        "SELECT service_id FROM reservations WHERE id = ?",
        [reservation_id],
      );
      if (resRows.length > 0) {
        const sId = resRows[0].service_id;
        const targetItem = itemsToCreate.find((i) => i.id === sId && i.type !== "product");
        if (targetItem && targetItem.qty > 0) {
          targetItem.qty -= 1;
        }
      }
    }

    // Insert walk-in reservations for the rest of the items and deduct stock for products
    const todayDate = new Date();
    // Use Asia/Jakarta timezone for date and time
    const today = todayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
    const time = todayDate.toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta" });

    for (const item of itemsToCreate) {
      let isProduct = item.type === "product";

      if (isProduct) {
        await db.query("UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?", [item.qty, item.id]);
      }

      for (let i = 0; i < item.qty; i++) {
        // Skip dummy reservation if it's "Registrasi Member"
        if (item.name && item.name.includes("Registrasi Member")) continue;

        let ticket_code =
          "WLK-" + crypto.randomBytes(3).toString("hex").toUpperCase();
        if (queue_number) {
          ticket_code =
            "WLK-" +
            String(queue_number).padStart(3, "0") +
            "-" +
            crypto.randomBytes(2).toString("hex").toUpperCase();
        }

        if (isProduct) {
          await db.query(
            "INSERT INTO reservations (ticket_code, customer_id, kapster_id, service_id, product_id, booking_date, booking_time, status, transaction_id) VALUES (?, NULL, ?, NULL, ?, ?, ?, 'completed', ?)",
            [ticket_code, kapster_id || null, item.id, today, time, newTransactionId],
          );
        } else {
          await db.query(
            "INSERT INTO reservations (ticket_code, customer_id, kapster_id, service_id, product_id, booking_date, booking_time, status, transaction_id) VALUES (?, NULL, ?, ?, NULL, ?, ?, 'completed', ?)",
            [ticket_code, kapster_id || null, item.id, today, time, newTransactionId],
          );
        }
      }
    }

    await db.query("COMMIT");

    res.status(201).json({
      message: "Transaction completed successfully",
      transaction_id: result.insertId,
      receipt_number,
      points_earned: newPoints,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
