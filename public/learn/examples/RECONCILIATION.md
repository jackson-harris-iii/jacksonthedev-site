# Synthetic reconciliation exercise

Everything here is invented. An expected order is not the same as a payment. Match on record_id. A repeated payment_id is a duplicate row, not a second payment. Preserve it in an exceptions report; count each payment_id once for this exercise. Unknown IDs remain unmatched. Do not silently allocate amounts.

Your goal: produce a report that tells a reviewer which records need investigation. Before using an assistant, predict the totals and list the exceptions you expect. Then ask it to build the report and compare it with your prediction.

Deliverable: matched rows, exceptions with source IDs and reasons, expected total, raw payment total, unique-payment total, and an explanation of why those totals differ. No sending or accounting updates.

Transfer task: change PAY-02's amount to 200.00 on both copies. Explain which exceptions disappear and which remain. Then introduce two rows with the same payment_id but different amounts: that is a conflicting duplicate requiring review, not something to resolve arbitrarily.

<details><summary>Answer key — open after your first attempt</summary>

Expected total: 350.00. Raw payment rows total: 485.00. Unique-payment total: 305.00. Matched unique payments: 280.00. Expected less matched: 70.00 (20.00 underpayment + 50.00 missing).

- DEMO-101 matches at 100.00.
- DEMO-102 has a 20.00 shortfall; PAY-02 repeats and must be flagged.
- DEMO-103 has no payment (50.00 expected).
- PAY-04 / DEMO-104 is an unmatched 25.00 payment.

Do not call the 45.00 net difference between 350.00 expected and 305.00 unique payments the total missing payment: the unmatched 25.00 obscures the 70.00 shortfall against expected records.

After both PAY-02 copies become 200.00: matched unique payments 300.00, unique payments 325.00, expected less matched 50.00. The duplicate, missing DEMO-103, and unmatched DEMO-104 still need review.

</details>
