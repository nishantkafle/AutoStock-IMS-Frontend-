import { useState, useEffect } from "react";
import { reviewService } from "../../services/api";
import Modal from "../../components/Modal";
import {
  Field,
  Btn,
  Alert,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

// Visual star display - just text dashes as ratings
function Stars({ rating }) {
  return (
    <span
      style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "2px" }}
    >
      {"- ".repeat(rating).trim()}{" "}
      <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
        ({rating}/5)
      </span>
    </span>
  );
}

function ReviewForm({ onSubmit, onClose, saving }) {
  const [form, setForm] = useState({ rating: "5", comment: "" });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Field
        label="Rating (1 to 5)"
        as="select"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
      >
        <option value="5">5 - Excellent</option>
        <option value="4">4 - Good</option>
        <option value="3">3 - Average</option>
        <option value="2">2 - Poor</option>
        <option value="1">1 - Very Poor</option>
      </Field>
      <Field
        label="Comment"
        as="textarea"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        placeholder="Share your experience with AutoStock"
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "6px",
        }}
      >
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn type="submit" disabled={saving}>
          {saving ? "Submitting..." : "Submit Review"}
        </Btn>
      </div>
    </form>
  );
}

export default function CustomerReviews() {
  const [myReviews, setMyReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [tab, setTab] = useState("all"); // "all" or "mine"

  async function load() {
    setLoading(true);
    try {
      const [myRes, allRes] = await Promise.all([
        reviewService.getMine(),
        reviewService.getAll(),
      ]);
      if (myRes.success) setMyReviews(myRes.data);
      if (allRes.success) setAllReviews(allRes.data);
    } catch {
      setMsg({ text: "Failed to load reviews", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(form) {
    setSaving(true);
    try {
      const res = await reviewService.create({
        rating: parseInt(form.rating),
        comment: form.comment,
      });
      if (res.success) {
        setShowAdd(false);
        setMsg({ text: "Review submitted", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to submit review", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await reviewService.delete(id);
      if (res.success) {
        setMsg({ text: "Review deleted", ok: true });
        load();
      }
    } catch {
      setMsg({ text: "Failed to delete review", ok: false });
    }
  }

  const displayed = tab === "mine" ? myReviews : allReviews;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
            }}
          >
            Reviews
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Share your experience with AutoStock
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>Write Review</Btn>
      </div>

      {msg.text && <Alert text={msg.text} ok={msg.ok} />}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {[
          ["all", "All Reviews"],
          ["mine", "My Reviews"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === key ? "var(--text)" : "var(--text-muted)",
              borderBottom:
                tab === key
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading...
          </div>
        ) : displayed.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            {tab === "mine"
              ? "You have not written any reviews yet."
              : "No reviews yet."}
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {(tab === "all"
                  ? ["Customer", "Rating", "Comment", "Date"]
                  : ["Rating", "Comment", "Date", "Action"]
                ).map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((r) => (
                <tr key={r.id}>
                  {tab === "all" && <td style={tdStyle}>{r.customerName}</td>}
                  <td style={tdStyle}>
                    <Stars rating={r.rating} />
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {r.comment || "-"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  {tab === "mine" && (
                    <td style={tdStyle}>
                      <Btn
                        variant="danger"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </Btn>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Write a Review" onClose={() => setShowAdd(false)}>
          <ReviewForm
            onSubmit={handleSubmit}
            onClose={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  );
}
