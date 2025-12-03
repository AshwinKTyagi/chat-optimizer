"use client";

import { useState, FormEvent } from 'react';

type Message = { role: 'user' | 'bot'; text: string };

export default function Page(): JSX.Element {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function sendMessage(e?: FormEvent) {
    e && e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();
      const botMsg: Message = { role: 'bot', text: data.reply || 'No reply' };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'bot', text: 'Error: could not reach server' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Chat Optimizer — Demo Chatbot (App Router)</h1>

        <div style={styles.chatBox}>
          {messages.length === 0 && <div style={styles.empty}>Start the conversation below.</div>}
          {messages.map((m, i) => (
            <div key={i} style={m.role === 'user' ? styles.userMsg : styles.botMsg}>
              <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <p style={styles.hint}>This demo uses a local API stub. Replace `/api/chat` with your model integration.</p>
      </div>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  page: { fontFamily: 'system-ui, sans-serif', padding: 20 },
  container: { maxWidth: 760, margin: '0 auto' },
  h1: { marginBottom: 12 },
  chatBox: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, minHeight: 200, marginBottom: 12, background: '#fff' },
  empty: { color: '#6b7280' },
  userMsg: { textAlign: 'right', margin: '8px 0', color: '#111' },
  botMsg: { textAlign: 'left', margin: '8px 0', color: '#111' },
  form: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' },
  button: { padding: '8px 14px', borderRadius: 6, border: 'none', background: '#111827', color: '#fff' },
  hint: { marginTop: 12, color: '#6b7280' }
};
